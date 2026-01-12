import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Company, CompanyService } from '../../services/company.service';
import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-form.component.html'
})
export class CompanyFormComponent implements OnInit {

  form = this.fb.group({
    name: ['', Validators.required],
    cnpj: ['', Validators.required],
    address: ['', Validators.required],
  });

  companyId?: number;
  loading = false;

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
        ...company,
        cnpj: DocumentMaskUtil.formatCnpj(company.cnpj)
      });
    });
  }

  salvar(): void {
    if (this.form.invalid) return;

    this.loading = true;

    const payload: Company = {
      ...this.form.value,
      cnpj: DocumentMaskUtil.clear(this.form.value.cnpj!)
    } as Company;

    const req = this.companyId
      ? this.companyService.update(this.companyId, payload)
      : this.companyService.create(payload);

    req.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/companies']);
      },
      error: () => this.loading = false
    });
  }

  voltar(): void {
    this.location.back();
  }

  onCnpjInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formatted = DocumentMaskUtil.formatCnpj(input.value);
    this.form.get('cnpj')?.setValue(formatted, { emitEvent: false });
  }
}
