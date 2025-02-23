<?php
namespace App\Http\Controllers;

use App\Models\CME;
use App\Models\GST;
use App\Models\Flare;
use App\Models\CMEAnalysis;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class DONKIController extends Controller
{
    public function search(Request $request)
    {
        // Validate incoming request parameters
        $validated = $request->validate([
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate',
            'eventType' => 'required|string|in:ALL,FLARE,CMES,GST,Analisys', // Added new event types
            'mostAccurateOnly' => 'boolean',
            'speed' => 'integer',
            'halfAngle' => 'integer',
        ]);

        // Determine the event type and fetch data from the database or API
        $eventType = $validated['eventType'];
        $startDate = $validated['startDate'];
        $endDate = $validated['endDate'];
        $dbStartDate = '2024-01-31';
        $dbEndDate = '2025-02-23';

        if ($startDate >= $dbStartDate && $endDate <= $dbEndDate) {
            // Fetch data from the database
            switch ($eventType) {
                case 'FLARE':
                    $data = Flare::whereBetween('begin_time', [$startDate, $endDate])->get();
                    break;
                case 'CMES':
                    $data = CME::whereBetween('start_time', [$startDate, $endDate])->with('analyses')->get();
                    break;
                case 'Analisys':
                    $data = CMEAnalysis::whereBetween('time21_5', [$startDate, $endDate])->get();
                    break;
                case 'GST':
                    $data = GST::whereBetween('start_time', [$startDate, $endDate])->with('kpIndices')->get();
                    break;
                case 'ALL':
                default:
                    $data = [
                        'flares' => Flare::whereBetween('begin_time', [$startDate, $endDate])->get(),
                        'cmes' => CME::whereBetween('start_time', [$startDate, $endDate])->with('analyses')->get(),
                        'gsts' => GST::whereBetween('start_time', [$startDate, $endDate])->with('kpIndices')->get(),
                    ];
                    break;
            }
        } else {
            // Fetch data from the NASA API
            $apiUrl = 'https://api.nasa.gov/DONKI/';
            $apiKey = env('NASA_API_KEY');
            $params = [
                'startDate' => $startDate,
                'endDate' => $endDate,
                'api_key' => $apiKey,
            ];

            switch ($eventType) {
                case 'FLARE':
                    $response = Http::withOptions(['verify' => false, 'timeout' => 60])->retry(3, 100)->get($apiUrl . 'FLR', $params);
                    break;
                case 'CMES':
                    $response = Http::withOptions(['verify' => false, 'timeout' => 60])->retry(3, 100)->get($apiUrl . 'CME', $params);
                    break;
                case 'GST':
                    $response = Http::withOptions(['verify' => false, 'timeout' => 60])->retry(3, 100)->get($apiUrl . 'GST', $params);
                    break;
                case 'Analisys':
                    $response = Http::withOptions(['verify' => false, 'timeout' => 60])->retry(3, 100)->get($apiUrl . 'Analisys', $params);
                    break;
                case 'ALL':
                default:
                    $response = Http::withOptions(['verify' => false, 'timeout' => 60])->retry(3, 100)->get($apiUrl . 'ALL', $params);
                    break;
            }

            if ($response->successful()) {
                $data = $response->json();
            } else {
                Log::error("Failed to fetch data from NASA API. Status: " . $response->status() . " Message: " . $response->body());
                return response()->json(['error' => 'Failed to fetch data from NASA API'], 500);
            }
        }

        // Return the data as JSON
        return response()->json($data, 200);
    }
}