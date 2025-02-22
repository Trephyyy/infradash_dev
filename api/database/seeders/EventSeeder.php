<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\CME;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $startYear = 2010;
        $currentYear = date('Y');

        for ($year = $startYear; $year <= $currentYear; $year++) {
            $startDate = "$year-01-01";
            $endDate = "$year-12-31";

            $response = Http::withOptions(['verify' => '/etc/ssl/certs/ca-certificates.crt'])->get('https://api.nasa.gov/DONKI/CME', [
                'startDate' => $startDate,
                'endDate' => $endDate,
                'catalog' => 'M2M_CATALOG',
                'api_key' => env('NASA_API_KEY'),
            ]);

            if ($response->successful()) {
                $data = $response->json();
                Log::info("Fetched " . count($data) . " events for year $year from DONKI API.");

                foreach ($data as $event) {
                    CME::updateOrCreate(
                        [
                            'begin_time' => $event['startTime'],
                            'end_time' => $event['endTime'],
                            'peak_time' => $event['peakTime'],
                            'catalog' => $event['catalog'],
                            'source_location' => $event['sourceLocation'] ?? null,
                            'speed' => $event['speed'] ?? null,
                            'half_angle' => $event['halfAngle'] ?? null,
                            'most_accurate_only' => $event['mostAccurateOnly'] ?? true,
                            'intensity' => $this->convertClassToScale($event['classType'] ?? null),
                            'class_type' => $event['classType'] ?? null,
                            'note' => $event['note'] ?? null,
                        ]
                    );
                }
            } else {
                Log::error("Failed to fetch data for year $year from DONKI API.");
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
