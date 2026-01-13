import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';
import { Company, CompanyPayload } from '../../../shared/models/company.model';

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
