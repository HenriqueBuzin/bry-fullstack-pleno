<?php

namespace App\Http\Controllers;

use App\Http\Requests\ClientStoreRequest;
use App\Http\Requests\ClientUpdateRequest;
use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ClientController extends Controller
{
    /**
     * GET /clients
     */
    public function index(): JsonResponse
    {
        $clients = Client::with('companies')->get();

        return response()->json($clients, 200);
    }

    /**
     * POST /clients
     */
    public function store(ClientStoreRequest $request): JsonResponse
    {
        $data = $request->validated();

        // cria cliente
        $client = Client::create($data);

        // upload do documento
        if ($request->hasFile('documento')) {
            $path = $request->file('documento')
                ->store("documents/clients/{$client->id}", 'public');

            $client->update([
                'documento_path' => $path,
                'documento_mime' => $request->file('documento')->getMimeType(),
            ]);
        }

        // vínculo com empresas
        if (!empty($data['company_ids'])) {
            $client->companies()->sync($data['company_ids']);
        }

        return response()->json(
            $client->load('companies'),
            201
        );
    }

    /**
     * GET /clients/{id}
     */
    public function show(Client $client): JsonResponse
    {
        return response()->json(
            $client->load('companies'),
            200
        );
    }

    /**
     * PUT /clients/{id}
     */
    public function update(
        ClientUpdateRequest $request,
        Client $client
    ): JsonResponse {
        $data = $request->validated();

        $client->update($data);

        // upload do documento
        if ($request->hasFile('documento')) {
            // remove documento antigo
            if ($client->documento_path) {
                Storage::disk('public')->delete($client->documento_path);
            }

            $path = $request->file('documento')
                ->store("documents/clients/{$client->id}", 'public');

            $client->update([
                'documento_path' => $path,
                'documento_mime' => $request->file('documento')->getMimeType(),
            ]);
        }

        // sync empresas
        if (array_key_exists('company_ids', $data)) {
            $client->companies()->sync($data['company_ids'] ?? []);
        }

        return response()->json(
            $client->load('companies'),
            200
        );
    }

    /**
     * DELETE /clients/{id}
     */
    public function destroy(Client $client): JsonResponse
    {
        // remove documento
        if ($client->documento_path) {
            Storage::disk('public')->delete($client->documento_path);
        }

        $client->delete();

        return response()->json(null, 204);
    }
}
