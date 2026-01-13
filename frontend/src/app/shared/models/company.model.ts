import { EmployeeSummary, ClientSummary } from './summaries.model';

export interface Company {
  id: number;
  name: string;
  cnpj: string;
  address: string;
  employees: EmployeeSummary[];
  clients: ClientSummary[];
}

export interface CompanyPayload {
  name: string;
  cnpj: string;
  address: string;
}
