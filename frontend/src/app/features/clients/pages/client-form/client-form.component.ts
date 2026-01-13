import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from '../../services/client.service';
import { Client } from '../../../../shared/models/client.model';
import { CompanyService } from '../../../companies/services/company.service';
import { Company } from '../../../../shared/models/company.model';
import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';
import { DocumentValidationsUtil } from '../../../../shared/utils/document-validations.utils';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-form.component.html'
})
export class ClientFormComponent implements OnInit {

  successMessage?: string;
  warningMessages: string[] = [];
  errorMessages: string[] = [];

  documentControl = new FormControl<File | null>(null);

  form = this.fb.group({
    login: this.fb.control('', [Validators.required, DocumentValidationsUtil.noAccent]),
    name: this.fb.control('', [Validators.required, DocumentValidationsUtil.noAccent]),
    cpf: this.fb.control('', [Validators.required, DocumentValidationsUtil.cpf]),
    email: this.fb.control('', [Validators.required, DocumentValidationsUtil.email]),
    address: this.fb.control('', [Validators.required]),
    password: this.fb.control(''),
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
  ) { }

  ngOnInit(): void {
    this.loadCompanies();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clientId = Number(id);
      this.loadClient(this.clientId);
    }
  }

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

    if (file) {
      const allowed = ['application/pdf', 'image/jpeg'];
      if (!allowed.includes(file.type)) {
        this.warningMessages = ['Documento inválido. Envie apenas PDF ou JPG.'];
        this.errorMessages = [];
        this.successMessage = undefined;
        input.value = '';
        this.documentControl.setValue(null);
        return;
      }
    }

    this.documentControl.setValue(file);
  }

  salvar(): void {
    this.submitted = true;
    this.successMessage = undefined;
    this.warningMessages = [];
    this.errorMessages = [];

    if (this.form.invalid) return;

    this.loading = true;

    const password = this.form.controls.password.value;

    if (!this.clientId && !password) {
      this.form.controls.password.setErrors({ required: true });
      this.loading = false;
      return;
    }

    if (password && password.length < 6) {
      this.form.controls.password.setErrors({ minlength: true });
      this.loading = false;
      return;
    }

    const formData = new FormData();

    formData.append('login', this.form.controls.login.value);
    formData.append('name', this.form.controls.name.value);
    formData.append('cpf', DocumentMaskUtil.clear(this.form.controls.cpf.value));
    formData.append('email', this.form.controls.email.value);
    formData.append('address', this.form.controls.address.value);

    if (password) {
      formData.append('password', password);
    }

    const companyIds = this.form.controls.company_ids.value;

    if (companyIds.length === 0) {
      formData.append('company_ids', '[]');
    } else {
      companyIds.forEach(id =>
        formData.append('company_ids[]', String(id))
      );
    }

    const file = this.documentControl.value;
    if (file) {
      formData.append('document', file, file.name);
    }

    if (this.clientId) {
      formData.append('_method', 'PUT');
    }

    const request = this.clientId
      ? this.clientService.update(this.clientId, formData)
      : this.clientService.create(formData);

    request.subscribe({
      next: () => {
        this.loading = false;

        if (this.clientId) {
          this.location.back();
        } else {
          this.successMessage = 'Cliente cadastrado com sucesso!';

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

        const result = this.extractMessages(err);
        this.warningMessages = result.warnings;
        this.errorMessages = result.errors;
      }
    });
  }

  private extractMessages(err: any): {
    warnings: string[];
    errors: string[];
  } {
    if (err?.status === 422 && err?.error?.errors) {
      return {
        warnings: Object.values(err.error.errors).flat() as string[],
        errors: []
      };
    }

    if (err?.error?.message) {
      return {
        warnings: [],
        errors: [err.error.message]
      };
    }

    return {
      warnings: [],
      errors: ['Erro ao salvar cliente. Verifique os dados e tente novamente.']
    };
  }

  voltar(): void {
    this.location.back();
  }

  campoInvalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || this.submitted);
  }
}
