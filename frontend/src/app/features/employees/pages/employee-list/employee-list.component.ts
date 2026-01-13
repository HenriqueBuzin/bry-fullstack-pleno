import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../../../shared/models/employee.model';
import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent implements OnInit {

  employees: Employee[] = [];
  loading = false;
  deletingId?: number;

  constructor(private employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.list().subscribe({
      next: (data: Employee[]) => {
        this.employees = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  excluir(employee: Employee): void {
    const confirmar = confirm(
      `Tem certeza que deseja remover o funcionário "${employee.name}"?`
    );

    if (!confirmar) return;

    this.deletingId = employee.id;

    this.employeeService.delete(employee.id).subscribe({
      next: () => {
        alert('Funcionário removido com sucesso.');
        this.deletingId = undefined;
        this.loadEmployees();
      },
      error: () => {
        alert('Erro ao remover funcionário. Tente novamente.');
        this.deletingId = undefined;
      }
    });
  }

  formatarCpf(cpf: string): string {
    return DocumentMaskUtil.formatCpf(cpf);
  }
}
