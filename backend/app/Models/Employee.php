<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'login',
        'name',
        'cpf',
        'email',
        'address',
        'password',
        'documento_path',
        'documento_mime',
    ];

    /**
     * Esconde a senha nas respostas JSON
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Hash automático da senha
     */
    protected static function booted()
    {
        static::creating(function ($employee) {
            if (!empty($employee->password)) {
                $employee->password = Hash::make($employee->password);
            }
        });

        static::updating(function ($employee) {
            if ($employee->isDirty('password')) {
                $employee->password = Hash::make($employee->password);
            }
        });
    }

    /**
     * Empresas associadas ao funcionário
     */
    public function companies()
    {
        return $this->belongsToMany(
            Company::class,
            'company_employee'
        );
    }
}
