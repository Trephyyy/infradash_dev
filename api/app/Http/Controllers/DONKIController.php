<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class DONKIController extends Controller
{
    public function search(Request $request)
    {
        // Validate incoming request parameters
        $validated = $request->validate([
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate',
            'eventType' => 'required|string|in:ALL,FLARE,CMES', // Assuming eventType can be 'ALL', 'FLARE', 'CMES' or other valid types
        ]);

        // Fetch data from the external API
        $response = Http::get('https://kauai.ccmc.gsfc.nasa.gov/DONKI/search/results', [
            'startDate' => $validated['startDate'],
            'endDate' => $validated['endDate'],
            'catalog' => 'M2M_CATALOG',
            'eventType' => $validated['eventType'],
        ]);

        // Check for a successful response from the API
        if ($response->successful()) {
            // Return the data from the API as JSON
            return response()->json($response->json(), 200);
        }

        // If the external API fails, return an error
        return response()->json(['error' => 'Failed to fetch data from DONKI API.'], 500);
    }
}
