<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'cnpj',
        'address',
    ];

    /**
     * Funcionários vinculados à empresa
     */
    public function employees()
    {
        return $this->belongsToMany(
            Employee::class,
            'company_employee'
        );
    }

    /**
     * Clientes vinculados à empresa
     */
    public function clients()
    {
        return $this->belongsToMany(
            Client::class,
            'company_client'
        );
    }
}
