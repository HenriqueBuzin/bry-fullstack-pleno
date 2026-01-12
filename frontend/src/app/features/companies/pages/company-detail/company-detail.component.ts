import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Company, CompanyService } from '../../services/company.service';
import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company-detail.component.html'
})
export class CompanyDetailComponent implements OnInit {

  company?: Company;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private location: Location
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCompany(id);
  }

  loadCompany(id: number): void {
    this.loading = true;
    this.companyService.getById(id).subscribe({
      next: (data: Company) => {
        this.company = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  voltar(): void {
    this.location.back();
  }

  formatCnpj(value: string): string {
    return DocumentMaskUtil.formatCnpj(value);
  }
}
