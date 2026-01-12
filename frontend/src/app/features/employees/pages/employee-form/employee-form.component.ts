import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee, EmployeeService } from '../../services/employee.service';
import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

function noAccentValidator(control: any) {
  const value = control.value;

  if (!value) {
    return null;
  }

  const regex = /^[A-Za-z0-9._-]+$/;
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
        ...employee,
        cpf: DocumentMaskUtil.formatCpf(employee.cpf)
      });
    });
  }

  onCpfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = DocumentMaskUtil.formatCpf(input.value);
    this.form.get('cpf')?.setValue(formatted, { emitEvent: false });
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  salvar(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const formData = new FormData();

    Object.entries(this.form.value).forEach(([key, value]) => {
      if (!value) return;

      if (key === 'cpf') {
        formData.append(key, DocumentMaskUtil.clear(value as string));
      } else {
        formData.append(key, value as any);
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
      error: () => this.loading = false
    });
  }

  voltar(): void {
    this.location.back();
  }
}
