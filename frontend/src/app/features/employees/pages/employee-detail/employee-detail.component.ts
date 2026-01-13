import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../../../shared/models/employee.model';
import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-detail.component.html'
})
export class EmployeeDetailComponent implements OnInit {

  employee?: Employee;
  loading = false;
  deleting = false;

  constructor(
    private route: ActivatedRoute,
    public employeeService: EmployeeService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;
    this.loadEmployee(id);
  }

  loadEmployee(id: number): void {
    this.loading = true;
    this.employeeService.getById(id).subscribe({
      next: (data: Employee) => {
        this.employee = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  voltar(): void {
    this.location.back();
  }

  formatarCpf(cpf: string): string {
    return DocumentMaskUtil.formatCpf(cpf);
  }

  excluir(): void {
    if (!this.employee) return;

    const confirmar = confirm(
      `Tem certeza que deseja remover o funcionário "${this.employee.name}"?`
    );

    if (!confirmar) return;

    this.deleting = true;

    this.employeeService.delete(this.employee.id).subscribe({
      next: () => {
        alert('Funcionário removido com sucesso.');
        this.router.navigate(['/funcionarios']);
      },
      error: () => {
        this.deleting = false;
        alert('Erro ao remover funcionário. Tente novamente.');
      }
    });
  }
}
