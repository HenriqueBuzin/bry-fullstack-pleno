import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';

export interface Employee {
  id?: number;
  login: string;
  name: string;
  cpf: string;
  email: string;
  address: string;
  companies?: any[];
  document_path?: string;
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

  create(data: Employee): Observable<Employee> {
    return this.api.post<Employee>(this.endpoint, data);
  }

  update(id: number, data: Employee): Observable<Employee> {
    return this.api.put<Employee>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }
}
