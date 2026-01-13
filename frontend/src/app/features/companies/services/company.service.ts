import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';

/**
 * Tipos mínimos para relacionamento
 */
export interface EmployeeSummary {
  id: number;
  name: string;
}

export interface ClientSummary {
  id: number;
  name: string;
}

/**
 * Entidade Company (GET)
 */
export interface Company {
  id: number;
  name: string;
  cnpj: string;
  address: string;
  employees: EmployeeSummary[];
  clients: ClientSummary[];
}

/**
 * Payload Company (POST / PUT)
 */
export interface CompanyPayload {
  name: string;
  cnpj: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  private readonly endpoint = 'companies';

  constructor(private api: ApiBaseService) {}

  list(): Observable<Company[]> {
    return this.api.get<Company[]>(this.endpoint);
  }

  getById(id: number): Observable<Company> {
    return this.api.get<Company>(`${this.endpoint}/${id}`);
  }

  create(data: CompanyPayload): Observable<Company> {
    return this.api.post<Company>(this.endpoint, data);
  }

  update(id: number, data: CompanyPayload): Observable<Company> {
    return this.api.put<Company>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
