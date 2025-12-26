export type ExpenseType = "PIX" | "CREDIT" | "MONEY" | "DEBIT";

export interface ExpenseResponse {
  id: number;
  name: string;
  type: ExpenseType;
  amount: number;
  description: string;
  createAt: string;
}