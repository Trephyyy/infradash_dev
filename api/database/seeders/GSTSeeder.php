<?php

namespace Database\Seeders;

use App\Models\GST;
use App\Models\KpIndex;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GSTSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $startDate = "2024-12-31";
        $endDate = "2025-02-22";
        $response = Http::withOptions(['verify' => false, 'timeout' => 60])->retry(3, 100)->get('https://api.nasa.gov/DONKI/GST', [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'api_key' => env('NASA_API_KEY'),
        ]);

        if ($response->successful()) {
            $data = $response->json();

            foreach ($data as $event) {
                $gst = GST::updateOrCreate(
                    ['gst_id' => $event['gstID']],
                    [
                        'start_time' => $event['startTime'] ?? null,
                        'link' => $event['link'] ?? null,
                        'submission_time' => $event['submissionTime'] ?? null,
                        'version_id' => $event['versionId'] ?? null,
                        'intensity' => $this->calculateIntensity($event['allKpIndex'])
                    ]
                );

                foreach ($event['allKpIndex'] as $kpIndex) {
                    KpIndex::updateOrCreate(
                        ['gst_id' => $gst->id, 'observed_time' => $kpIndex['observedTime']],
                        [
                            'kp_index' => $kpIndex['kpIndex'] ?? null,
                            'source' => $kpIndex['source'] ?? null
                        ]
                    );
                }
            }
        }
    }

    private function calculateIntensity($kpIndices)
    {
        $totalKp = array_sum(array_column($kpIndices, 'kpIndex'));
        $count = count($kpIndices);
        $averageKp = $totalKp / $count;

        // Normalize the average Kp index to a scale of 1-100
        $minKp = 0; // Define the minimum Kp index observed
        $maxKp = 9; // Define the maximum Kp index observed
        $normalizedIntensity = (($averageKp - $minKp) / ($maxKp - $minKp)) * 100;

        // Ensure the intensity is between 1 and 100
        return max(1, min(100, round($normalizedIntensity)));
    }
}
