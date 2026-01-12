import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Client, ClientService } from '../../services/client.service';
import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client-detail.component.html'
})
export class ClientDetailComponent implements OnInit {

  client?: Client;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private location: Location
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
}
