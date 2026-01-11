<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EmployeeUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'login' => [
                'required',
                'string',
                'max:50',
                Rule::unique('employees', 'login')->ignore($this->route('employee')),
                'regex:/^[A-Za-z0-9._-]+$/',
            ],
            'nome' => [
                'required',
                'string',
                'max:255',
                'regex:/^[A-Za-z ]+$/',
            ],
            'cpf' => [
                'required',
                'string',
                Rule::unique('employees', 'cpf')->ignore($this->route('employee')),
            ],
            'email' => [
                'required',
                'email',
                Rule::unique('employees', 'email')->ignore($this->route('employee')),
            ],
            'endereco' => [
                'required',
                'string',
                'max:255',
            ],
            'password' => [
                'nullable',
                'string',
                'min:6',
            ],

            'documento' => [
                'nullable',
                'file',
                'mimes:pdf,jpg,jpeg',
                'max:5120',
            ],

            'company_ids' => ['sometimes', 'array'],
            'company_ids.*' => ['integer', 'exists:companies,id'],
        ];
    }
}
