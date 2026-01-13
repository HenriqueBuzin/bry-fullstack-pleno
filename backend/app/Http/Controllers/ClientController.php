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

        // password já é hasheada no Model (booted)
        $client = Client::create($data);

        if ($request->hasFile('document')) {
            $path = $request->file('document')
                ->store("documents/clients/{$client->id}", 'public');

            $client->update([
                'document_path' => $path,
                'document_mime' => $request->file('document')->getMimeType(),
            ]);
        }

        if (array_key_exists('company_ids', $data)) {
            $client->companies()->sync($data['company_ids'] ?? []);
        }

        return response()->json(
            $client->load('companies'),
            201
        );
    }

    /**
     * GET /clients/{id}
     */
    public function show(int $id): JsonResponse
    {
        $client = Client::with('companies')->find($id);

        if (!$client) {
            return response()->json(['message' => 'Cliente não encontrado'], 404);
        }

        return response()->json($client, 200);
    }

    /**
     * PUT /clients/{id}
     */
    public function update(
        ClientUpdateRequest $request,
        Client $client
    ): JsonResponse {
        $data = $request->validated();

        // se password vier vazia, não atualiza
        if (empty($data['password'])) {
            unset($data['password']);
        }

        $client->update($data);

        if ($request->hasFile('document')) {
            if ($client->document_path) {
                Storage::disk('public')->delete($client->document_path);
            }

            $path = $request->file('document')
                ->store("documents/clients/{$client->id}", 'public');

            $client->update([
                'document_path' => $path,
                'document_mime' => $request->file('document')->getMimeType(),
            ]);
        }

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
        if ($client->document_path) {
            Storage::disk('public')->delete($client->document_path);
        }

        $client->delete();

        return response()->json(null, 204);
    }

    /**
     * GET /clients/{client}/document
     */
    public function downloadDocument(Client $client)
    {
        if (!$client->document_path) {
            return response()->json(
                ['message' => 'Documento não encontrado'],
                404
            );
        }

        return Storage::disk('public')->download(
            $client->document_path
        );
    }

}
