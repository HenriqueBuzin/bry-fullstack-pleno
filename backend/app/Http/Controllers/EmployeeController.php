<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeStoreRequest;
use App\Http\Requests\EmployeeUpdateRequest;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

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

        // password é hasheada automaticamente no Model
        $employee = Employee::create($data);

        // upload do documento
        if ($request->hasFile('document')) {
            $path = $request->file('document')
                ->store("documents/employees/{$employee->id}", 'public');

            $employee->update([
                'document_path' => $path,
                'document_mime' => $request->file('document')->getMimeType(),
            ]);
        }

        // vínculo com empresas
        if (array_key_exists('company_ids', $data)) {
            $employee->companies()->sync($data['company_ids'] ?? []);
        }

        return response()->json(
            $employee->load('companies'),
            201
        );
    }

    /**
     * GET /employees/{id}
     */
    public function show(int $id): JsonResponse
    {
        $employee = Employee::with('companies')->find($id);

        if (!$employee) {
            return response()->json(
                ['message' => 'Funcionário não encontrado'],
                404
            );
        }

        return response()->json($employee, 200);
    }

    /**
     * PUT /employees/{id}
     */
    public function update(
        EmployeeUpdateRequest $request,
        Employee $employee
    ): JsonResponse {
        $data = $request->validated();

        // se password não veio, não altera
        if (empty($data['password'])) {
            unset($data['password']);
        }

        $employee->update($data);

        if ($request->hasFile('document')) {
            if ($employee->document_path) {
                Storage::disk('public')->delete($employee->document_path);
            }

            $path = $request->file('document')
                ->store("documents/employees/{$employee->id}", 'public');

            $employee->update([
                'document_path' => $path,
                'document_mime' => $request->file('document')->getMimeType(),
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
        if ($employee->document_path) {
            Storage::disk('public')->delete($employee->document_path);
        }

        $employee->delete();

        return response()->json(null, 204);
    }
}
