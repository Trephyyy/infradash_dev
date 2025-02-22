<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class DONKIController extends Controller
{
    public function search(Request $request)
    {
        // Validate incoming request parameters
        $validated = $request->validate([
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate',
            'eventType' => 'required|string|in:ALL,FLARE,CMES,GST,IPS,SEP,HSS,MPC,RBE', // Added new event types
            'mostAccurateOnly' => 'boolean',
            'speed' => 'integer',
            'halfAngle' => 'integer',
        ]);

        // Determine the API endpoint based on the eventType
        $eventType = $validated['eventType'];
        $apiEndpoint = $this->getApiEndpoint($eventType);

        // Fetch data from the external API
        $response = Http::withOptions(['verify' => '/etc/ssl/certs/ca-certificates.crt'])->get($apiEndpoint, [
            'startDate' => $validated['startDate'],
            'endDate' => $validated['endDate'],
            'catalog' => 'M2M_CATALOG',
            'api_key' => env('NASA_API_KEY'),
            'mostAccurateOnly' => $request->input('mostAccurateOnly', true),
            'speed' => $request->input('speed', 500),
            'halfAngle' => $request->input('halfAngle', 30),
        ]);

        // Log the response for debugging
        Log::info('DONKI API response', ['response' => $response->json()]);

        // Check for a successful response from the API
        if ($response->successful()) {
            $data = $response->json();

            // Convert class to intensity scale
            foreach ($data as &$event) {
                if (isset($event['classType'])) {
                    $event['intensity'] = $this->convertClassToScale($event['classType']);
                }
            }

            // Return the data from the API as JSON
            return response()->json($data, 200);
        }

        return response()->json(['error' => 'Failed to fetch data from DONKI API.'], 500);
    }

    function convertClassToScale($classType)
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

    private function getApiEndpoint($eventType)
    {
        switch ($eventType) {
            case 'FLARE':
                return 'https://api.nasa.gov/DONKI/FLR';
            case 'CMES':
                return 'https://api.nasa.gov/DONKI/CME';
            case 'GST':
                return 'https://api.nasa.gov/DONKI/GST';
            case 'IPS':
                return 'https://api.nasa.gov/DONKI/IPS';
            case 'SEP':
                return 'https://api.nasa.gov/DONKI/SEP';
            case 'HSS':
                return 'https://api.nasa.gov/DONKI/HSS';
            case 'MPC':
                return 'https://api.nasa.gov/DONKI/MPC';
            case 'RBE':
                return 'https://api.nasa.gov/DONKI/RBE';
            case 'ALL':
            default:
                return 'https://api.nasa.gov/DONKI/CMEAnalysis';
        }
    }
}