import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Company, CompanyService } from '../../services/company.service';
import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-list.component.html'
})
export class CompanyListComponent implements OnInit {

  companies: Company[] = [];
  loading = false;

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading = true;
    this.companyService.list().subscribe({
      next: (data: Company[]) => {
        this.companies = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  formatarCnpj(cnpj: string): string {
    return DocumentMaskUtil.formatCnpj(cnpj);
  }
}
