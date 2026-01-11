<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:255'],
            'cnpj' => [
                'required',
                'string',
                'max:20',
                Rule::unique('companies', 'cnpj')->ignore($this->route('company')),
            ],
            'endereco' => ['required', 'string', 'max:255'],

            'employee_ids' => ['sometimes', 'array'],
            'employee_ids.*' => ['integer', 'exists:employees,id'],

            'client_ids' => ['sometimes', 'array'],
            'client_ids.*' => ['integer', 'exists:clients,id'],
        ];
    }
}
