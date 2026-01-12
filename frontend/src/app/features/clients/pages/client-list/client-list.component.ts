import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Client, ClientService } from '../../services/client.service';
import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-list.component.html'
})
export class ClientListComponent implements OnInit {

  clients: Client[] = [];
  loading = false;

  constructor(private clientService: ClientService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.list().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  formatarCpf(cpf: string): string {
    return DocumentMaskUtil.formatCpf(cpf);
  }
}
