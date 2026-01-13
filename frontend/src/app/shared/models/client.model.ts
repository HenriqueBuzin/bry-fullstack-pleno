import { CompanySummary } from './summaries.model';

export interface Client {
  id: number;
  login: string;
  name: string;
  cpf: string;
  email: string;
  address: string;
  companies?: CompanySummary[];
  document_path?: string;
}
