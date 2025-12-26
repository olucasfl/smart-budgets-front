import type { ExpenseResponse } from "../../dtos/ExpenseResponse";
import { expenseService } from "../../services/expenseService";

const TYPE_LABELS: Record<string, string> = {
  PIX: "Pix",
  CREDIT: "Crédito",
  DEBIT: "Débito",
  MONEY: "Dinheiro"
};

const TYPE_COLORS: Record<string, string> = {
  PIX: "#6366f1",
  CREDIT: "#8b5cf6",
  DEBIT: "#22c55e",
  MONEY: "#f59e0b"
};

export default function ExpenseItem({
  expense,
  hubId,
  onDeleted
}: {
  expense: ExpenseResponse;
  hubId: number;
  onDeleted: () => void;
}) {
  const handleDelete = async () => {
    if (!confirm("Deseja realmente excluir esta despesa?")) return;
    await expenseService.delete(hubId, expense.id);
    onDeleted();
  };

  const formattedDate = expense.createAt
    ? new Date(expense.createAt).toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    : "-";

  return (
    <div className="card fade-in">
      <div className="expense-header">
        <strong>{expense.name}</strong>
        <strong>R$ {expense.amount.toFixed(2)}</strong>
      </div>

      <div className="expense-meta">
        <span style={{ color: TYPE_COLORS[expense.type] }}>
          {TYPE_LABELS[expense.type]}
        </span>
        <span className="muted">{formattedDate}</span>
      </div>

      {expense.description && (
        <p className="muted">{expense.description}</p>
      )}

      <button className="danger" onClick={handleDelete}>
        Excluir
      </button>
    </div>
  );
}
