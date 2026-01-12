import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'empresas',
    loadComponent: () =>
      import('./features/companies/pages/company-list/company-list.component')
        .then(m => m.CompanyListComponent)
  },
  {
    path: 'empresas/novo',
    loadComponent: () =>
      import('./features/companies/pages/company-form/company-form.component')
        .then(m => m.CompanyFormComponent)
  },
  {
    path: 'empresas/:id',
    loadComponent: () =>
      import('./features/companies/pages/company-detail/company-detail.component')
        .then(m => m.CompanyDetailComponent)
  },

  {
    path: 'funcionarios',
    loadComponent: () =>
      import('./features/employees/pages/employee-list/employee-list.component')
        .then(m => m.EmployeeListComponent)
  },
  {
    path: 'funcionarios/novo',
    loadComponent: () =>
      import('./features/employees/pages/employee-form/employee-form.component')
        .then(m => m.EmployeeFormComponent)
  },
  {
    path: 'funcionarios/:id',
    loadComponent: () =>
      import('./features/employees/pages/employee-detail/employee-detail.component')
        .then(m => m.EmployeeDetailComponent)
  },

  {
    path: 'clientes',
    loadComponent: () =>
      import('./features/clients/pages/client-list/client-list.component')
        .then(m => m.ClientListComponent)
  },
  {
    path: 'clientes/novo',
    loadComponent: () =>
      import('./features/clients/pages/client-form/client-form.component')
        .then(m => m.ClientFormComponent)
  },
  {
    path: 'clientes/:id',
    loadComponent: () =>
      import('./features/clients/pages/client-detail/client-detail.component')
        .then(m => m.ClientDetailComponent)
  },

  { path: '', redirectTo: 'empresas', pathMatch: 'full' }
];
