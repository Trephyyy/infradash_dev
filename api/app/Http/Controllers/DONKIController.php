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
            'eventType' => 'required|string|in:ALL,FLARE,CMES', // Assuming eventType can be 'ALL', 'FLARE', 'CMES' or other valid types
            'mostAccurateOnly' => 'boolean',
            'speed' => 'integer',
            'halfAngle' => 'integer',
        ]);

        // Fetch data from the external API
        $response = Http::withOptions(['verify' => '/etc/ssl/certs/ca-certificates.crt'])->get('https://api.nasa.gov/DONKI/CMEAnalysis', [
            'startDate' => $validated['startDate'],
            'endDate' => $validated['endDate'],
            'catalog' => 'M2M_CATALOG',
            'api_key' => env('NASA_API_KEY'),
            'eventType' => $validated['eventType'],
            'mostAccurateOnly' => $request->input('mostAccurateOnly', true),
            'speed' => $request->input('speed', 500),
            'halfAngle' => $request->input('halfAngle', 30),
        ]);

        // Log the response for debugging


        // Check for a successful response from the API
        if ($response->successful()) {
            // Return the data from the API as JSON
            return response()->json($response->json(), 200);
        }


        return response()->json(['error' => 'Failed to fetch data from DONKI API.'], 500);
    }
}