import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ClientService, Client } from '../../services/client.service';
import { Company, CompanyService } from '../../../companies/services/company.service';

import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';
import { DocumentValidationsUtil } from '../../../../shared/utils/document-validations.utils';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html'
})
export class ClientFormComponent implements OnInit {

  // ✅ alertas bootstrap
  successMessage = '';
  errorMessage = '';

  // ✅ upload
  documentControl = new FormControl<File | null>(null);

  form = this.fb.group({
    login: this.fb.control('', [Validators.required, DocumentValidationsUtil.noAccent]),
    name: this.fb.control('', [Validators.required, DocumentValidationsUtil.noAccent]),
    cpf: this.fb.control('', [Validators.required, DocumentValidationsUtil.cpf]),
    email: this.fb.control('', [Validators.required, DocumentValidationsUtil.email]),
    address: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required, Validators.minLength(6)]),
    company_ids: this.fb.control<number[]>([])
  });

  clientId?: number;
  companies: Company[] = [];
  loading = false;
  submitted = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private clientService: ClientService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadCompanies();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientId = Number(id);
      this.loadClient(this.clientId);

      // ✅ senha só no CREATE
      this.form.controls.password.clearValidators();
      this.form.controls.password.updateValueAndValidity();
    }
  }

  /* ===== Empresas ===== */

  loadCompanies(): void {
    this.companyService.list().subscribe({
      next: data => this.companies = data
    });
  }

  onCompanyToggle(companyId: number): void {
    const selected = this.form.controls.company_ids.value;

    this.form.controls.company_ids.setValue(
      selected.includes(companyId)
        ? selected.filter(id => id !== companyId)
        : [...selected, companyId]
    );
  }

  /* ===== Cliente ===== */

  loadClient(id: number): void {
    this.clientService.getById(id).subscribe((client: Client) => {
      this.form.patchValue({
        login: client.login,
        name: client.name,
        cpf: DocumentMaskUtil.formatCpf(client.cpf),
        email: client.email,
        address: client.address,
        company_ids: client.companies?.map(c => c.id) ?? []
      });
    });
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.controls.cpf.setValue(
      DocumentMaskUtil.formatCpf(input.value),
      { emitEvent: false }
    );
  }

  onDocumentSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    // validação básica client-side
    if (file) {
      const allowed = ['application/pdf', 'image/jpeg'];
      if (!allowed.includes(file.type)) {
        this.errorMessage = 'Documento inválido. Envie apenas PDF ou JPG.';
        this.successMessage = '';
        input.value = '';
        this.documentControl.setValue(null);
        return;
      }
    }

    this.documentControl.setValue(file);
  }

  salvar(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    // no update, password pode ficar vazio, então não travar por ele
    if (this.form.invalid) return;

    this.loading = true;

    // ✅ sempre FormData (porque pode ter arquivo)
    const formData = new FormData();

    formData.append('login', this.form.controls.login.value);
    formData.append('name', this.form.controls.name.value);
    formData.append('cpf', DocumentMaskUtil.clear(this.form.controls.cpf.value));
    formData.append('email', this.form.controls.email.value);
    formData.append('address', this.form.controls.address.value);

    // senha só no create
    if (!this.clientId) {
      formData.append('password', this.form.controls.password.value);
    }

    // empresas
    this.form.controls.company_ids.value.forEach(id =>
      formData.append('company_ids[]', String(id))
    );

    // documento (opcional)
    const file = this.documentControl.value;
    if (file) {
      // use o nome do campo que seu Laravel espera (ex: document, file, documento...)
      formData.append('document', file, file.name);
    }

    const request = this.clientId
      ? this.clientService.update(this.clientId, formData)
      : this.clientService.create(formData);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = this.clientId
          ? 'Cliente atualizado com sucesso!'
          : 'Cliente cadastrado com sucesso!';
        this.errorMessage = '';

        // se quiser limpar tudo quando for CREATE:
        if (!this.clientId) {
          this.form.reset({
            login: '',
            name: '',
            cpf: '',
            email: '',
            address: '',
            password: '',
            company_ids: []
          });
          this.documentControl.setValue(null);
          this.submitted = false;
        }
      },
      error: (err: any) => {
        this.loading = false;

        // tenta pegar mensagem do Laravel (422)
        const msg =
          err?.error?.message ||
          (typeof err?.error === 'string' ? err.error : null) ||
          'Erro ao salvar. Verifique os campos e tente novamente.';

        this.errorMessage = msg;
        this.successMessage = '';
      }
    });
  }

  voltar(): void {
    this.location.back();
  }

  campoInvalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.submitted);
  }
}
