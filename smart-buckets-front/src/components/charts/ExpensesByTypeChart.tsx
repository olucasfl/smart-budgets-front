import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import type { ExpenseResponse } from "../../dtos/ExpenseResponse";

const COLORS: Record<string, string> = {
  PIX: "#6366f1",
  CREDIT: "#8b5cf6",
  DEBIT: "#22c55e",
  MONEY: "#f59e0b"
};

const TYPE_LABELS: Record<string, string> = {
  PIX: "Pix",
  CREDIT: "Crédito",
  DEBIT: "Débito",
  MONEY: "Dinheiro"
};

export function ExpensesByTypeChart({
  expenses
}: {
  expenses: ExpenseResponse[];
}) {
  const data = Object.entries(
    expenses.reduce((acc: Record<string, number>, e) => {
      acc[e.type] = (acc[e.type] || 0) + e.amount;
      return acc;
    }, {})
  ).map(([type, value]) => ({
    type, // 🔑 enum original
    name: TYPE_LABELS[type] ?? type, // 👈 label em PT-BR
    value
  }));

  if (data.length === 0) {
    return <p className="muted">Sem dados por tipo.</p>;
  }

  return (
    <div>
      <h3 style={{ marginBottom: 16 }}>
        Distribuição por tipo
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
          >
            {data.map(entry => (
              <Cell
                key={entry.type}
                fill={COLORS[entry.type]} // ✅ agora funciona
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) =>
              typeof value === "number"
                ? `R$ ${value.toFixed(2)}`
                : "R$ 0,00"
            }
          />

          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
