<?php

namespace Database\Seeders;

use App\Models\CME;
use App\Models\CMEAnalysis;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Log;

class CMESeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = base_path('cme.json');

        if (!file_exists($filePath)) {
            Log::error("File not found: $filePath");
            return;
        }

        $data = json_decode(file_get_contents($filePath), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::error("Failed to decode JSON from file: " . json_last_error_msg());
            return;
        }

        foreach ($data as $event) {
            if (isset($event['cmeAnalyses']) && count($event['cmeAnalyses']) > 0) {
                $cme = CME::updateOrCreate(
                    ['activity_id' => $event['activityID']],
                    [
                        'catalog' => $event['catalog'] ?? null,
                        'start_time' => $event['startTime'] ?? null,
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
                            'latitude' => $analysis['latitude'] ?? null,
                            'longitude' => $analysis['longitude'] ?? null,
                            'half_angle' => $analysis['halfAngle'] ?? null,
                            'speed' => $analysis['speed'] ?? null,
                            'type' => $analysis['type'] ?? null,
                            'image_type' => $analysis['imageType'] ?? null,
                            'note' => substr($analysis['note'] ?? null, 0, 255),
                            'tilt' => $analysis['tilt'] ?? null,
                            'submission_time' => $analysis['submissionTime'] ?? null,
                            'link' => $analysis['link'] ?? null
                        ]
                    );
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
