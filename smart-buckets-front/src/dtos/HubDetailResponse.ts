import type { ExpenseResponse } from "./ExpenseResponse";

export interface HubDetailResponse {
  id: number;
  name: string;
  description: string;
  budgetLimit: number;
  expenses: ExpenseResponse[];
}
