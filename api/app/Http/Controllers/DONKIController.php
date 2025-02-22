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
            // Return the data from the API as JSON
            return response()->json($response->json(), 200);
        }

        return response()->json(['error' => 'Failed to fetch data from DONKI API.'], 500);
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