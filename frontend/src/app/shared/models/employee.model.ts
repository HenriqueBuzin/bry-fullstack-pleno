import { CompanySummary } from './summaries.model';

export interface Employee {
  id: number;
  login: string;
  name: string;
  cpf: string;
  email: string;
  address: string;
  companies?: CompanySummary[];
  document_path?: string;
}

export interface EmployeePayload {
  login: string;
  name: string;
  cpf: string;
  email: string;
  address: string;
  password?: string;
  company_ids?: number[];
}
