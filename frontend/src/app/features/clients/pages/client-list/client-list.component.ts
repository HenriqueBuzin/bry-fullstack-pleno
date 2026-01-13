import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../../../shared/models/client.model';
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
  deletingId?: number;

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

  excluir(client: Client): void {
    const confirmar = confirm(
      `Tem certeza que deseja remover o cliente "${client.name}"?`
    );

    if (!confirmar) return;

    this.deletingId = client.id;

    this.clientService.delete(client.id).subscribe({
      next: () => {
        alert('Cliente removido com sucesso.');
        this.deletingId = undefined;
        this.loadClients();
      },
      error: () => {
        alert('Erro ao remover cliente. Tente novamente.');
        this.deletingId = undefined;
      }
    });
  }

  formatarCpf(cpf: string): string {
    return DocumentMaskUtil.formatCpf(cpf);
  }
}
