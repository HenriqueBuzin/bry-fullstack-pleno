<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ClientController;

Route::apiResource('companies', CompanyController::class);
Route::apiResource('employees', EmployeeController::class);
Route::apiResource('clients', ClientController::class);

Route::get('employees/{employee}/document', [EmployeeController::class, 'downloadDocument']);
Route::get('clients/{client}/document', [ClientController::class, 'downloadDocument']);
