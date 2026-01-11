<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientStoreRequest extends FormRequest
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
                'unique:clients,login',
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
                'max:14',
                'unique:clients,cpf',
            ],
            'email' => [
                'required',
                'email',
                'unique:clients,email',
            ],
            'endereco' => [
                'required',
                'string',
                'max:255',
            ],
            'password' => [
                'required',
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

    public function messages(): array
    {
        return [
            'login.regex' => 'O login não pode conter acentuação.',
            'nome.regex' => 'O nome não pode conter acentuação.',
            'documento.mimes' => 'O documento deve ser PDF ou JPG.',
        ];
    }
}
