import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';
import { Employee } from '../../../shared/models/employee.model';

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

  update(id: number, data: FormData) {
    return this.api.post<Employee>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  getDocumentDownloadUrl(id: number): string {
    return this.api.downloadUrl(`${this.endpoint}/${id}/document`);
  }

}
