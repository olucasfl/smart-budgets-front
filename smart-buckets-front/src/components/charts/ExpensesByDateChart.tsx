import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { useState } from "react";
import type { ExpenseResponse } from "../../dtos/ExpenseResponse";

/* 🎨 CORES POR ENUM */
const COLORS: Record<string, string> = {
  PIX: "#6366f1",
  CREDIT: "#8b5cf6",
  DEBIT: "#22c55e",
  MONEY: "#f59e0b"
};

/* 🇧🇷 LABELS EM PT-BR */
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
  const [visibleTypes, setVisibleTypes] = useState<Record<string, boolean>>({
    PIX: true,
    CREDIT: true,
    DEBIT: true,
    MONEY: true
  });

  /* 1️⃣ AGRUPA POR DATA + TIPO (GARANTINDO ZERO) */
  const grouped: Record<string, Record<string, number>> = {};

  expenses.forEach(e => {
    if (!e.createAt) return;

    const date = new Date(e.createAt).toLocaleDateString("pt-BR");

    if (!grouped[date]) {
      grouped[date] = {};
      TYPES.forEach(type => {
        grouped[date][type] = 0;
      });
    }

    grouped[date][e.type] += Number(e.amount);
  });

  /* 2️⃣ CONVERTE PARA O RECHARTS */
  const data = Object.entries(grouped).map(([date, values]) => ({
    date,
    ...values
  }));

  if (data.length === 0) {
    return <p className="muted">Sem dados por data.</p>;
  }

  return (
    <div>
      <h3 style={{ marginBottom: 12 }}>
        Gastos ao longo do tempo
      </h3>

      {/* 🎛️ FILTROS */}
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 16,
          flexWrap: "wrap"
        }}
      >
        {TYPES.map(type => (
          <label
            key={type}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              opacity: visibleTypes[type] ? 1 : 0.4
            }}
          >
            <input
              type="checkbox"
              checked={visibleTypes[type]}
              onChange={() =>
                setVisibleTypes(prev => ({
                  ...prev,
                  [type]: !prev[type]
                }))
              }
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: COLORS[type]
              }}
            />
            {TYPE_LABELS[type]}
          </label>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value, name) =>
              typeof value === "number"
                ? [`R$ ${value.toFixed(2)}`, TYPE_LABELS[name as string]]
                : ["R$ 0,00", ""]
            }
          />
          <Legend
            formatter={(value) =>
              TYPE_LABELS[value as string] ?? value
            }
          />

          {TYPES.map(
            type =>
              visibleTypes[type] && (
                <Line
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stroke={COLORS[type]}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              )
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
