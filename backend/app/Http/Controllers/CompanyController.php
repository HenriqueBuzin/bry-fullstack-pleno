<?php

namespace App\Http\Controllers;

use App\Http\Requests\CompanyStoreRequest;
use App\Http\Requests\CompanyUpdateRequest;
use App\Models\Company;
use Illuminate\Http\JsonResponse;

class CompanyController extends Controller
{
    /**
     * GET /companies
     */
    public function index(): JsonResponse
    {
        $companies = Company::with(['employees', 'clients'])->get();

        return response()->json($companies, 200);
    }

    /**
     * POST /companies
     */
    public function store(CompanyStoreRequest $request): JsonResponse
    {
        $data = $request->validated();

        $company = Company::create($data);

        // vínculo com funcionários
        if (!empty($data['employee_ids'])) {
            $company->employees()->sync($data['employee_ids']);
        }

        // vínculo com clientes
        if (!empty($data['client_ids'])) {
            $company->clients()->sync($data['client_ids']);
        }

        return response()->json(
            $company->load(['employees', 'clients']),
            201
        );
    }

    /**
     * GET /companies/{id}
     */
    public function show(Company $company): JsonResponse
    {
        return response()->json(
            $company->load(['employees', 'clients']),
            200
        );
    }

    /**
     * PUT /companies/{id}
     */
    public function update(
        CompanyUpdateRequest $request,
        Company $company
    ): JsonResponse {
        $data = $request->validated();

        $company->update($data);

        if (array_key_exists('employee_ids', $data)) {
            $company->employees()->sync($data['employee_ids'] ?? []);
        }

        if (array_key_exists('client_ids', $data)) {
            $company->clients()->sync($data['client_ids'] ?? []);
        }

        return response()->json(
            $company->load(['employees', 'clients']),
            200
        );
    }

    /**
     * DELETE /companies/{id}
     */
    public function destroy(Company $company): JsonResponse
    {
        $company->delete();

        return response()->json(null, 204);
    }
}
