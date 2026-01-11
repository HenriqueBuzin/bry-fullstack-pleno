<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeStoreRequest;
use App\Http\Requests\EmployeeUpdateRequest;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class EmployeeController extends Controller
{
    /**
     * GET /employees
     */
    public function index(): JsonResponse
    {
        $employees = Employee::with('companies')->get();

        return response()->json($employees, 200);
    }

    /**
     * POST /employees
     */
    public function store(EmployeeStoreRequest $request): JsonResponse
    {
        $data = $request->validated();

        // 🔐 hash da senha
        $data['password'] = Hash::make($data['password']);

        // cria funcionário
        $employee = Employee::create($data);

        // upload do documento
        if ($request->hasFile('documento')) {
            $path = $request->file('documento')
                ->store("documents/employees/{$employee->id}", 'public');

            $employee->update([
                'documento_path' => $path,
                'documento_mime' => $request->file('documento')->getMimeType(),
            ]);
        }

        // vínculo com empresas
        if (!empty($data['company_ids'])) {
            $employee->companies()->sync($data['company_ids']);
        }

        return response()->json(
            $employee->load('companies'),
            201
        );
    }

    /**
     * GET /employees/{id}
     */
    public function show(Employee $employee): JsonResponse
    {
        return response()->json(
            $employee->load('companies'),
            200
        );
    }

    /**
     * PUT /employees/{id}
     */
    public function update(
        EmployeeUpdateRequest $request,
        Employee $employee
    ): JsonResponse {
        $data = $request->validated();

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $employee->update($data);

        if ($request->hasFile('documento')) {
            if ($employee->documento_path) {
                Storage::disk('public')->delete($employee->documento_path);
            }

            $path = $request->file('documento')
                ->store("documents/employees/{$employee->id}", 'public');

            $employee->update([
                'documento_path' => $path,
                'documento_mime' => $request->file('documento')->getMimeType(),
            ]);
        }

        if (array_key_exists('company_ids', $data)) {
            $employee->companies()->sync($data['company_ids'] ?? []);
        }

        return response()->json(
            $employee->load('companies'),
            200
        );
    }

    /**
     * DELETE /employees/{id}
     */
    public function destroy(Employee $employee): JsonResponse
    {
        if ($employee->documento_path) {
            Storage::disk('public')->delete($employee->documento_path);
        }

        $employee->delete();

        return response()->json(null, 204);
    }
}
