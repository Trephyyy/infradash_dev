<?php

namespace Database\Seeders;

use App\Models\Flare;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $startDate = "2024-01-31";
        $endDate = "2025-02-22";

        $response = Http::withOptions(['verify' => false])->get('https://api.nasa.gov/DONKI/FLR', [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'catalog' => 'ALL',
            'api_key' => env('NASA_API_KEY'),
        ]);

        if ($response->successful()) {
            $data = $response->json();

            foreach ($data as $event) {
                Log::info("Processing event: " . json_encode($event));
                Flare::updateOrCreate(
                    ['flr_id' => $event['flrID']],
                    [
                        'begin_time' => $event['beginTime'] ?? null,
                        'peak_time' => $event['peakTime'] ?? null,
                        'end_time' => $event['endTime'] ?? null,
                        'intensity' => $this->convertClassToScale($event['classType'] ?? null),
                    ]
                );
            }
        }
    }

    private function convertClassToScale($classType)
    {
        // Map class types to intensity ranges (scaled from 1-100)
        $classMap = [
            "A" => [1, 10],  // A-class: 1-10 (lowest intensity)
            "B" => [11, 20], // B-class: 11-20
            "C" => [21, 40], // C-class: 21-40
            "M" => [41, 70], // M-class: 41-70
            "X" => [71, 100] // X-class: 71-100 (highest intensity)
        ];

        // Extract the letter class and number (e.g., "M2.3" -> "M", 2.3)
        if (isset($classMap[$classType[0]])) {
            $baseClass = $classType[0];
            $number = floatval(substr($classType, 1));

            // Default to 1 if no number is provided (e.g., "M" -> "M1")
            if ($number === 0) {
                $number = 1.0;
            }

            // Get the class range
            list($minValue, $maxValue) = $classMap[$baseClass];

            // Normalize the number within the given class range (A=1-10, B=11-20, etc.)
            $intensityScale = $minValue + ($number * ($maxValue - $minValue) / 10);

            // Return the rounded intensity value
            return round($intensityScale);
        } else {
            Log::error("Invalid class type format");
            return null;
        }
    }
}
