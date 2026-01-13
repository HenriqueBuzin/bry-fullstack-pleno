import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../../../shared/models/company.model';
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
  deletingId?: number;

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

  excluir(company: Company): void {
    const confirmar = confirm(
      `Tem certeza que deseja remover a empresa "${company.name}"?`
    );

    if (!confirmar) return;

    this.deletingId = company.id;

    this.companyService.delete(company.id).subscribe({
      next: () => {
        alert('Empresa removida com sucesso.');
        this.deletingId = undefined;
        this.loadCompanies();
      },
      error: () => {
        alert('Erro ao remover empresa. Tente novamente.');
        this.deletingId = undefined;
      }
    });
  }

  formatarCnpj(cnpj: string): string {
    return DocumentMaskUtil.formatCnpj(cnpj);
  }
}
