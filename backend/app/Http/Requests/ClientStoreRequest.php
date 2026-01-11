<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'cpf' => isset($this->cpf)
                ? preg_replace('/\D/', '', $this->cpf)
                : null,
        ]);
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
                'digits:11',
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
            'required' => 'O campo :attribute é obrigatório.',
            'string' => 'O campo :attribute deve ser um texto.',
            'email' => 'O campo :attribute deve ser um e-mail válido.',
            'unique' => 'O valor informado para :attribute já está em uso.',
            'exists' => 'O valor selecionado para :attribute é inválido.',
            'min.string' => 'O campo :attribute deve ter no mínimo :min caracteres.',
            'max.string' => 'O campo :attribute deve ter no máximo :max caracteres.',
            'regex' => 'O campo :attribute possui formato inválido.',
            'file' => 'O campo :attribute deve ser um arquivo.',
            'mimes' => 'O arquivo deve estar nos formatos: :values.',
        ];
    }

    public function attributes(): array
    {
        return [
            'login' => 'login',
            'nome' => 'nome',
            'cpf' => 'CPF',
            'email' => 'e-mail',
            'endereco' => 'endereço',
            'password' => 'senha',
            'documento' => 'documento',
            'company_ids' => 'empresas',
            'company_ids.*' => 'empresa',
        ];
    }

}
