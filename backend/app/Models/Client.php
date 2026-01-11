<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Hash;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'login',
        'nome',
        'cpf',
        'email',
        'endereco',
        'password',
        'documento_path',
        'documento_mime',
    ];

    protected $hidden = [
        'password',
    ];

    protected static function booted()
    {
        static::creating(function ($client) {
            if (!empty($client->password)) {
                $client->password = Hash::make($client->password);
            }
        });

        static::updating(function ($client) {
            if ($client->isDirty('password')) {
                $client->password = Hash::make($client->password);
            }
        });
    }

    /**
     * Empresas associadas ao cliente
     */
    public function companies()
    {
        return $this->belongsToMany(
            Company::class,
            'company_client'
        );
    }
}
