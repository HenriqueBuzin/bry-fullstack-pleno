<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompanyStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // não temos autenticação
    }

    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:255'],
            'cnpj' => ['required', 'string', 'max:20', 'unique:companies,cnpj'],
            'endereco' => ['required', 'string', 'max:255'],

            // vínculos opcionais
            'employee_ids' => ['sometimes', 'array'],
            'employee_ids.*' => ['integer', 'exists:employees,id'],

            'client_ids' => ['sometimes', 'array'],
            'client_ids.*' => ['integer', 'exists:clients,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'O nome da empresa é obrigatório.',
            'cnpj.required' => 'O CNPJ é obrigatório.',
            'cnpj.unique' => 'Este CNPJ já está cadastrado.',
            'endereco.required' => 'O endereço é obrigatório.',
        ];
    }
}
