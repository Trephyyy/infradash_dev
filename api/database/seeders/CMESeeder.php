<?php

namespace Database\Seeders;

use App\Models\CME;
use App\Models\CMEAnalysis;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CMESeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $startDate = "2024-12-31";
        $endDate = "2025-02-22";

        $response = Http::withOptions(['verify' => false, 'timeout' => 60])->retry(3, 100)->get('https://api.nasa.gov/DONKI/CME', [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'catalog' => 'ALL',
            'api_key' => env('NASA_API_KEY'),
        ]);

        if ($response->successful()) {
            $data = $response->json();

            foreach ($data as $event) {
                if (isset($event['cmeAnalyses']) && count($event['cmeAnalyses']) > 0) {
                    $cme = CME::updateOrCreate(
                        ['activity_id' => $event['activityID']],
                        [
                            'catalog' => $event['catalog'] ?? null,
                            'start_time' => $event['startTime'] ?? null,
                            'source_location' => $event['sourceLocation'] ?? null,
                            'active_region_num' => $event['activeRegionNum'] ?? null,
                            'note' => substr($event['note'] ?? null, 0, 255),
                            'submission_time' => $event['submissionTime'] ?? null,
                            'version_id' => $event['versionId'] ?? null,
                            'link' => $event['link'] ?? null,
                            'intensity' => $this->calculateIntensity($event['cmeAnalyses'])
                        ]
                    );

                    foreach ($event['cmeAnalyses'] as $analysis) {
                        CMEAnalysis::updateOrCreate(
                            ['cme_id' => $cme->id, 'time21_5' => $analysis['time21_5']],
                            [
                                'is_most_accurate' => $analysis['isMostAccurate'] ?? false,
                                'latitude' => $analysis['latitude'] ?? null,
                                'longitude' => $analysis['longitude'] ?? null,
                                'half_angle' => $analysis['halfAngle'] ?? null,
                                'speed' => $analysis['speed'] ?? null,
                                'type' => $analysis['type'] ?? null,
                                'feature_code' => $analysis['featureCode'] ?? null,
                                'image_type' => $analysis['imageType'] ?? null,
                                'measurement_technique' => $analysis['measurementTechnique'] ?? null,
                                'note' => substr($analysis['note'] ?? null, 0, 255),
                                'level_of_data' => $analysis['levelOfData'] ?? null,
                                'tilt' => $analysis['tilt'] ?? null,
                                'minor_half_width' => $analysis['minorHalfWidth'] ?? null,
                                'speed_measured_at_height' => $analysis['speedMeasuredAtHeight'] ?? null,
                                'submission_time' => $analysis['submissionTime'] ?? null,
                                'link' => $analysis['link'] ?? null
                            ]
                        );
                    }
                }
            }
        }
    }

    private function calculateIntensity($analyses)
    {
        $totalSpeed = array_sum(array_column($analyses, 'speed'));
        $count = count($analyses);
        $averageSpeed = $totalSpeed / $count;

        // Normalize the average speed to a scale of 1-100
        $minSpeed = 0; // Define the minimum speed observed
        $maxSpeed = 2000; // Define the maximum speed observed
        $normalizedIntensity = (($averageSpeed - $minSpeed) / ($maxSpeed - $minSpeed)) * 100;

        // Ensure the intensity is between 1 and 100
        return max(1, min(100, round($normalizedIntensity)));
    }
}
