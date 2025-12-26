import { useState } from "react";
import type { ExpenseResponse } from "../../dtos/ExpenseResponse";

export function HubCharts({ expenses }: { expenses: ExpenseResponse[] }) {
  const [index, setIndex] = useState(0);

  const charts = [
    {
      title: "Gastos por tipo",
      content: <pre>{JSON.stringify(groupByType(expenses), null, 2)}</pre>
    },
    {
      title: "Gastos por data",
      content: <pre>{JSON.stringify(groupByDate(expenses), null, 2)}</pre>
    }
  ];

  return (
    <div className="charts-carousel">
      <button onClick={() => setIndex(i => Math.max(i - 1, 0))}>
        ◀
      </button>

      <div className="chart-card">
        <h4>{charts[index].title}</h4>
        {charts[index].content}
      </div>

      <button
        onClick={() =>
          setIndex(i => Math.min(i + 1, charts.length - 1))
        }
      >
        ▶
      </button>
    </div>
  );
}

function groupByType(expenses: ExpenseResponse[]) {
  return expenses.reduce((acc: any, e) => {
    acc[e.type] = (acc[e.type] || 0) + e.amount;
    return acc;
  }, {});
}

function groupByDate(expenses: ExpenseResponse[]) {
  return expenses.reduce((acc: any, e) => {
    const day = new Date(e.createAt).toLocaleDateString();
    acc[day] = (acc[day] || 0) + e.amount;
    return acc;
  }, {});
}
