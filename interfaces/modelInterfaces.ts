export enum Role {
  customer = 'customer',
  admin = 'admin',
  agent = 'agent',
}

export enum LoanTypes {
  personalLoan = 'personal Loan',
  homeLoan = 'home loan',
  carLoan = 'car loan',
  educationLoan = 'education loan',
}

export interface Loan {
  id: string;
  name: string;
  type: LoanTypes;
  priciple: number;
  duration_in_months: number;
  paid_amount: number;
  rate: number;
}
