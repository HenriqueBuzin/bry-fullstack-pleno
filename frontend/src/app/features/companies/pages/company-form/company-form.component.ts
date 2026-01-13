import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  CompanyService,
  CompanyPayload
} from '../../services/company.service';

import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-form.component.html'
})
export class CompanyFormComponent implements OnInit {

  // ✅ somente required (conforme enunciado)
  form = this.fb.group({
    name: ['', Validators.required],
    cnpj: ['', Validators.required],
    address: ['', Validators.required],
  });

  companyId?: number;
  loading = false;
  submitted = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.companyId = Number(id);
      this.loadCompany(this.companyId);
    }
  }

  loadCompany(id: number): void {
    this.companyService.getById(id).subscribe(company => {
      this.form.patchValue({
        name: company.name,
        address: company.address,
        cnpj: DocumentMaskUtil.formatCnpj(company.cnpj)
      });
    });
  }

  onCnpjInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = DocumentMaskUtil.formatCnpj(input.value);
    this.form.get('cnpj')?.setValue(formatted, { emitEvent: false });
  }

  private cnpjEhValido(cnpjFormatado: string): boolean {
    const cnpj = DocumentMaskUtil.clear(cnpjFormatado || '');
    return /^\d{14}$/.test(cnpj);
  }

  salvar(): void {
    this.submitted = true;
    this.successMessage = null;
    this.errorMessage = null;

    if (this.form.invalid) return;

    if (!this.cnpjEhValido(this.form.value.cnpj!)) {
      this.form.get('cnpj')?.setErrors({ invalidCnpj: true });
      return;
    }

    this.loading = true;

    const payload: CompanyPayload = {
      name: this.form.value.name!,
      address: this.form.value.address!,
      cnpj: DocumentMaskUtil.clear(this.form.value.cnpj!)
    };

    const request = this.companyId
      ? this.companyService.update(this.companyId, payload)
      : this.companyService.create(payload);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Empresa salva com sucesso!';
        this.router.navigate(['/empresas']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erro ao salvar empresa. Tente novamente.';
      }
    });
  }

  voltar(): void {
    this.location.back();
  }

  campoInvalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  campoValido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!(control && control.valid && (control.touched || this.submitted));
  }
}
