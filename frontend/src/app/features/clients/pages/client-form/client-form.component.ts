import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Client, ClientService } from '../../services/client.service';
import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html'
})
export class ClientFormComponent implements OnInit {

  form = this.fb.group({
    name: ['', Validators.required],
    cpf: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required]
  });

  clientId?: number;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientId = Number(id);
      this.loadClient(this.clientId);
    }
  }

  loadClient(id: number): void {
    this.clientService.getById(id).subscribe(client => {
      this.form.patchValue({
        ...client,
        cpf: DocumentMaskUtil.formatCpf(client.cpf)
      });
    });
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = DocumentMaskUtil.formatCpf(input.value);
    this.form.get('cpf')?.setValue(formatted, { emitEvent: false });
  }

  salvar(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const payload: Client = {
      ...this.form.value,
      cpf: DocumentMaskUtil.clear(this.form.value.cpf!)
    } as Client;

    const request = this.clientId
      ? this.clientService.update(this.clientId, payload)
      : this.clientService.create(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/clientes']);
      },
      error: () => this.loading = false
    });
  }

  voltar(): void {
    this.location.back();
  }
}
