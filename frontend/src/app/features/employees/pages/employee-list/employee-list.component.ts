import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Employee, EmployeeService } from '../../services/employee.service';
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

  formatarCpf(cpf: string): string {
    return DocumentMaskUtil.formatCpf(cpf);
  }
}
