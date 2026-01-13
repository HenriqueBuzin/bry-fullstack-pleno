<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CompanyStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Normaliza CNPJ antes da validação
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'cnpj' => isset($this->cnpj)
                ? preg_replace('/\D/', '', $this->cnpj)
                : null,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required', 
                'string', 
                'max:255',
                'regex:/^[A-Za-z0-9 ]+$/',
            ],

            'cnpj' => [
                'required',
                'digits:14',
                'unique:companies,cnpj',
            ],

            'address' => ['required', 'string', 'max:255'],

            'employee_ids' => ['sometimes', 'array'],
            'employee_ids.*' => ['integer', 'exists:employees,id'],

            'client_ids' => ['sometimes', 'array'],
            'client_ids.*' => ['integer', 'exists:clients,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'cnpj.unique' => 'Este CNPJ já está cadastrado.',

            'required' => 'O campo :attribute é obrigatório.',
            'string' => 'O campo :attribute deve ser um texto.',
            'integer' => 'O campo :attribute deve ser um número inteiro.',
            'array' => 'O campo :attribute deve ser uma lista.',
            'unique' => 'O valor informado para :attribute já está em uso.',
            'exists' => 'O valor selecionado para :attribute é inválido.',
            'digits' => 'O campo :attribute deve conter :digits dígitos.',
            'max.string' => 'O campo :attribute deve ter no máximo :max caracteres.',
        ];
    }

    public function attributes(): array
    {
        return [
            'name' => 'nome da empresa',
            'cnpj' => 'CNPJ',
            'address' => 'endereço',

            'employee_ids' => 'funcionários',
            'employee_ids.*' => 'funcionário',

            'client_ids' => 'clientes',
            'client_ids.*' => 'cliente',
        ];
    }
}
