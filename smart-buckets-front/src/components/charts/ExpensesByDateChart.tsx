import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import type { ExpenseResponse } from "../../dtos/ExpenseResponse";

/* 🎨 CORES SUAVES */
const COLORS: Record<string, string> = {
  PIX: "#6366F1",
  CREDIT: "#A855F7",
  DEBIT: "#22C55E",
  MONEY: "#F59E0B"
};

/* 🇧🇷 LABELS */
const TYPE_LABELS: Record<string, string> = {
  PIX: "Pix",
  CREDIT: "Crédito",
  DEBIT: "Débito",
  MONEY: "Dinheiro"
};

const TYPES = ["PIX", "CREDIT", "DEBIT", "MONEY"] as const;

export function ExpensesByDateChart({
  expenses
}: {
  expenses: ExpenseResponse[];
}) {
  /* 1️⃣ AGRUPA POR DATA (SEM TIMEZONE) */
  const grouped: Record<string, Record<string, number>> = {};

  expenses.forEach(e => {
    if (!e.createAt) return;

    // 👉 USA A DATA CRUA DO BACKEND
    const rawDate = e.createAt.slice(0, 10); // YYYY-MM-DD

    if (!grouped[rawDate]) {
      grouped[rawDate] = {
        PIX: 0,
        CREDIT: 0,
        DEBIT: 0,
        MONEY: 0
      };
    }

    grouped[rawDate][e.type] += Number(e.amount);
  });

  /* 2️⃣ CONVERTE PARA RECHARTS (ORDENADO) */
  const data = Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([rawDate, values]) => {
      const [y, m, d] = rawDate.split("-");
      return {
        date: `${d}/${m}`, // EXIBIÇÃO
        ...values
      };
    });

  if (data.length === 0) {
    return <p className="muted">Sem dados por data.</p>;
  }

  /* 3️⃣ SÓ MOSTRA LINHAS QUE TÊM VALOR */
  const hasValue = (type: string) =>
    data.some(d => d[type as keyof typeof d] > 0);

  return (
    <div>
      <h3 style={{ marginBottom: 12 }}>
        Gastos ao longo do tempo
      </h3>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="date"
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
            minTickGap={24}
          />

          <YAxis
            stroke="#94a3b8"
            tick={{ fontSize: 12 }}
            tickFormatter={v => `R$ ${v}`}
          />

          <Tooltip
            contentStyle={{
              background: "#020617",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.08)"
            }}
            labelStyle={{
              color: "#e5e7eb",
              fontWeight: 600
            }}
            formatter={(value: number, name: string) =>
              value > 0
                ? [`R$ ${value.toFixed(2)}`, TYPE_LABELS[name]]
                : null
            }
          />

          <Legend
            formatter={(value) =>
              TYPE_LABELS[value as string] ?? value
            }
          />

          {TYPES.map(
            type =>
              hasValue(type) && (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={COLORS[type]}
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              )
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
