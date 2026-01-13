import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { EmployeeService } from '../../services/employee.service';
import { EmployeePayload } from '../../../../shared/models/employee.model';

import { CompanyService } from '../../../companies/services/company.service';
import { Company } from '../../../../shared/models/company.model';

import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';
import { DocumentValidationsUtil } from '../../../../shared/utils/document-validations.utils';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnInit {

  form = this.fb.group({
    login: ['', [Validators.required, DocumentValidationsUtil.noAccent]],
    name: ['', [Validators.required, DocumentValidationsUtil.noAccent]],
    cpf: ['', [Validators.required, DocumentValidationsUtil.cpf]],
    email: ['', [Validators.required, DocumentValidationsUtil.email]],
    address: ['', Validators.required],
    password: [''],
    company_ids: [[] as number[]]
  });

  companies: Company[] = [];
  employeeId?: number;
  selectedFile?: File;

  loading = false;
  submitted = false;

  successMessage?: string;
  warningMessages: string[] = [];
  errorMessages: string[] = [];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.loadCompanies();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId = Number(id);
      this.loadEmployee(this.employeeId);

      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  get companyIds(): number[] {
    return this.form.controls.company_ids.value ?? [];
  }

  loadCompanies(): void {
    this.companyService.list().subscribe({
      next: data => this.companies = data
    });
  }

  onCompanyToggle(companyId: number): void {
    const selected = this.companyIds;

    this.form.controls.company_ids.setValue(
      selected.includes(companyId)
        ? selected.filter(id => id !== companyId)
        : [...selected, companyId]
    );
  }

  loadEmployee(id: number): void {
    this.employeeService.getById(id).subscribe(employee => {
      this.form.patchValue({
        login: employee.login,
        name: employee.name,
        cpf: DocumentMaskUtil.formatCpf(employee.cpf),
        email: employee.email,
        address: employee.address,
        company_ids: employee.companies?.map(c => c.id) ?? []
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

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  salvar(): void {
    this.submitted = true;
    this.successMessage = undefined;
    this.warningMessages = [];
    this.errorMessages = [];

    if (this.form.invalid) return;

    this.loading = true;

    const password = this.form.value.password;

    if (!this.employeeId && !password) {
      this.form.get('password')?.setErrors({ required: true });
      this.loading = false;
      return;
    }

    if (password && password.length < 6) {
      this.form.get('password')?.setErrors({ minlength: true });
      this.loading = false;
      return;
    }

    const payload: EmployeePayload = {
      login: this.form.value.login!,
      name: this.form.value.name!,
      cpf: DocumentMaskUtil.clear(this.form.value.cpf!),
      email: this.form.value.email!,
      address: this.form.value.address!,
      password: password || undefined,
      company_ids: this.companyIds
    };

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {

      if (Array.isArray(value)) {
        if (value.length === 0) {
          formData.append(key, '[]');
        } else {
          value.forEach(v => formData.append(`${key}[]`, String(v)));
        }
        return;
      }

      if (value !== undefined && value !== null && value !== '') {
        formData.append(key, String(value));
      }
    });

    if (this.selectedFile) {
      formData.append('document', this.selectedFile);
    }

    if (this.employeeId) {
      formData.append('_method', 'PUT');
    }

    const request = this.employeeId
      ? this.employeeService.update(this.employeeId, formData)
      : this.employeeService.create(formData);

    request.subscribe({
      next: () => {
        this.loading = false;

        if (this.employeeId) {
          this.location.back();
        } else {
          this.successMessage = 'Funcionário cadastrado com sucesso!';

          this.form.reset({
            login: '',
            name: '',
            cpf: '',
            email: '',
            address: '',
            password: '',
            company_ids: []
          });

          this.selectedFile = undefined;
          this.submitted = false;
        }
      },
      error: err => {
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
      errors: ['Erro inesperado ao salvar funcionário.']
    };
  }

  voltar(): void {
    this.location.back();
  }

  campoInvalido(campo: string): boolean {
    const c = this.form.get(campo);
    return !!(c && c.invalid && (c.touched || this.submitted));
  }
}
