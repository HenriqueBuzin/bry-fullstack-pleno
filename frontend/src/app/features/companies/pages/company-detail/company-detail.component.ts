import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { CompanyService } from '../../services/company.service';
import { Company } from '../../../../shared/models/company.model';
import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './company-detail.component.html'
})
export class CompanyDetailComponent implements OnInit {

  company?: Company;
  loading = false;
  deleting = false;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
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

  excluir(): void {
    if (!this.company) return;

    const confirmar = confirm(
      `Tem certeza que deseja remover a empresa "${this.company.name}"?`
    );

    if (!confirmar) return;

    this.deleting = true;

    this.companyService.delete(this.company.id).subscribe({
      next: () => {
        alert('Empresa removida com sucesso.');
        this.router.navigate(['/empresas']);
      },
      error: () => {
        this.deleting = false;
        alert('Erro ao remover empresa. Tente novamente.');
      }
    });
  }
}
