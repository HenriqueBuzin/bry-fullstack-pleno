import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';
import { Client } from '../../../shared/models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private readonly endpoint = 'clients';

  constructor(private api: ApiBaseService) {}

  list(): Observable<Client[]> {
    return this.api.get<Client[]>(this.endpoint);
  }

  getById(id: number): Observable<Client> {
    return this.api.get<Client>(`${this.endpoint}/${id}`);
  }

  create(data: FormData): Observable<Client> {
    return this.api.post<Client>(this.endpoint, data);
  }

  update(id: number, data: FormData): Observable<Client> {
    return this.api.post<Client>(`${this.endpoint}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.api.delete<void>(`${this.endpoint}/${id}`);
  }

  getDocumentDownloadUrl(id: number): string {
    return this.api.downloadUrl(`${this.endpoint}/${id}/document`);
  }

}
