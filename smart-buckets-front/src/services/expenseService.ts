import { api } from "../api/axios";
import type { ExpenseRequest } from "../dtos/ExpenseRequest";
import type { ExpenseResponse } from "../dtos/ExpenseResponse";

export const expenseService = {
  create: (hubId: number, data: ExpenseRequest) =>
    api.post<ExpenseResponse>(`/hub/${hubId}/expense/create`, data),

  update: (hubId: number, id: number, data: ExpenseRequest) =>
    api.put<ExpenseResponse>(`/hub/${hubId}/expense/update/${id}`, data),

  delete: (hubId: number, id: number) =>
    api.delete(`/hub/${hubId}/expense/delete/${id}`),
};
