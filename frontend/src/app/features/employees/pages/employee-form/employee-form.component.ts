import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  EmployeeService,
  EmployeePayload
} from '../../services/employee.service';

import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

/**
 * Validador: impede acentuação
 * (exigência do enunciado)
 */
function noAccentValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (!value) return null;

  const regex = /^[A-Za-z0-9._\- ]+$/;
  return regex.test(value) ? null : { accent: true };
}

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html'
})
export class EmployeeFormComponent implements OnInit {

  form = this.fb.group({
    login: ['', [Validators.required, noAccentValidator]],
    name: ['', [Validators.required, noAccentValidator]],
    cpf: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    password: ['', Validators.required],
    document: [null]
  });

  employeeId?: number;
  loading = false;
  submitted = false;

  selectedFile?: File;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.employeeId = Number(id);
      this.loadEmployee(this.employeeId);
    }
  }

  loadEmployee(id: number): void {
    this.employeeService.getById(id).subscribe(employee => {
      this.form.patchValue({
        login: employee.login,
        name: employee.name,
        cpf: DocumentMaskUtil.formatCpf(employee.cpf),
        email: employee.email,
        address: employee.address
      });

      // senha não volta do backend
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    });
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = DocumentMaskUtil.formatCpf(input.value);
    this.form.get('cpf')?.setValue(formatted, { emitEvent: false });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  salvar(): void {
    this.submitted = true;

    if (this.form.invalid) return;

    this.loading = true;

    const payload: EmployeePayload = {
      login: this.form.value.login!,
      name: this.form.value.name!,
      cpf: DocumentMaskUtil.clear(this.form.value.cpf!),
      email: this.form.value.email!,
      address: this.form.value.address!,
      password: this.form.value.password || undefined
    };

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value);
      }
    });

    if (this.selectedFile) {
      formData.append('document', this.selectedFile);
    }

    const request = this.employeeId
      ? this.employeeService.update(this.employeeId, formData as any)
      : this.employeeService.create(formData as any);

    request.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/employees']);
      },
      error: () => {
        this.loading = false;
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
