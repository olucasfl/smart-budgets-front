import type { ExpenseResponse } from "../../dtos/ExpenseResponse";
import { expenseService } from "../../services/expenseService";

export function ExpenseItem({
  expense,
  hubId,
  onDeleted
}: {
  expense: ExpenseResponse;
  hubId: number;
  onDeleted: () => void;
}) {
  return (
    <div className="card">
      <strong>{expense.name}</strong> – R$ {expense.amount}

      <button
        className="danger"
        style={{ marginLeft: 8 }}
        onClick={() => expenseService.delete(hubId, expense.id).then(onDeleted)}
      >
        Excluir
      </button>
    </div>
  );
}
