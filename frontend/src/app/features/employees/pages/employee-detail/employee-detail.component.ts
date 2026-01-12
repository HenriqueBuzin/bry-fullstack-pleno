import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { Employee, EmployeeService } from '../../services/employee.service';
import { DocumentMaskUtil } from '../../../../shared/utils/document-mask.util';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-detail.component.html'
})
export class EmployeeDetailComponent implements OnInit {

  employee?: Employee;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private location: Location
  ) {}

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
}
