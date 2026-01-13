import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';

/**
 * Relacionamento simples com empresa
 */
export interface CompanySummary {
  id: number;
  name: string;
}

/**
 * Entidade Employee (GET)
 */
export interface Employee {
  id: number;
  login: string;
  name: string;
  cpf: string;
  email: string;
  address: string;
  companies?: CompanySummary[];
  document_path?: string;
}

/**
 * ✅ PAYLOAD (PRECISA ESTAR EXPORTADO)
 */
export interface EmployeePayload {
  login: string;
  name: string;
  cpf: string;
  email: string;
  address: string;
  password?: string;
  company_ids?: number[];
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private readonly endpoint = 'employees';

  constructor(private api: ApiBaseService) {}

  list(): Observable<Employee[]> {
    return this.api.get<Employee[]>(this.endpoint);
  }

  getById(id: number): Observable<Employee> {
    return this.api.get<Employee>(`${this.endpoint}/${id}`);
  }

  create(data: FormData): Observable<Employee> {
    return this.api.post<Employee>(this.endpoint, data);
  }

  update(id: number, data: FormData): Observable<Employee> {
    return this.api.put<Employee>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
