import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { ClientService } from '../../services/client.service';
import { Client } from '../../../../shared/models/client.model';
import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './client-detail.component.html'
})
export class ClientDetailComponent implements OnInit {

  client?: Client;
  loading = false;
  deleting = false;

  constructor(
    private route: ActivatedRoute,
    public clientService: ClientService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.loadClient(id);
  }

  loadClient(id: number): void {
    this.loading = true;
    this.clientService.getById(id).subscribe({
      next: data => {
        this.client = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  voltar(): void {
    this.location.back();
  }

  formatarCpf(cpf: string): string {
    return DocumentMaskUtil.formatCpf(cpf);
  }

  excluir(): void {
    if (!this.client) return;

    const confirmar = confirm(
      `Tem certeza que deseja remover o cliente "${this.client.name}"?`
    );

    if (!confirmar) return;

    this.deleting = true;

    this.clientService.delete(this.client.id).subscribe({
      next: () => {
        alert('Cliente removido com sucesso.');
        this.router.navigate(['/clientes']);
      },
      error: () => {
        this.deleting = false;
        alert('Erro ao remover cliente. Tente novamente.');
      }
    });
  }
}
