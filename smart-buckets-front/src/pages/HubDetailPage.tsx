import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hubService } from "../services/hubService";
import type { HubDetailResponse } from "../dtos/HubDetailResponse";
import { ExpenseForm } from "../components/expense/ExpenseForm";
import { ExpenseItem } from "../components/expense/ExpenseItem";
import { HubProgress } from "../components/hub/HubProgress";

export function HubDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hubId = Number(id);

  const [hub, setHub] = useState<HubDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = () => {
    setLoading(true);
    hubService.findDetail(hubId).then(res => {
      setHub(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    let active = true;

    setLoading(true);

    hubService.findDetail(hubId)
      .then(res => {
        if (active) {
          setHub(res.data);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [hubId]);

  if (loading || !hub) {
    return (
      <div className="container">
        <p className="muted">Carregando hub...</p>
      </div>
    );
  }

  const totalSpent = hub.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = hub.budgetLimit - totalSpent;

  return (
    <div className="container fade-in">
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24
        }}
      >
        <div>
          <h2>{hub.name}</h2>
          <p className="muted">{hub.description}</p>
        </div>

        <button onClick={() => navigate(-1)}>
          ← Voltar
        </button>
      </div>

      {/* ORÇAMENTO */}
      <div className="card" style={{ marginBottom: 24 }}>
        <HubProgress
          spent={totalSpent}
          limit={hub.budgetLimit}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 16
          }}
        >
          <span className="muted">
            Gasto: <strong>R$ {totalSpent.toFixed(2)}</strong>
          </span>

          <span
            style={{
              color: remaining < 0 ? "var(--danger)" : "var(--success)",
              fontWeight: 600
            }}
          >
            Saldo: R$ {remaining.toFixed(2)}
          </span>
        </div>
      </div>

      {/* FORM DE DESPESA */}
      <ExpenseForm hubId={hubId} onSaved={reload} />

      {/* LISTA DE DESPESAS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
          marginTop: 24
        }}
      >
        {hub.expenses.length === 0 && (
          <p className="muted">
            Nenhuma despesa cadastrada ainda.
          </p>
        )}

        {hub.expenses.map(expense => (
          <ExpenseItem
            key={expense.id}
            expense={expense}
            hubId={hubId}
            onDeleted={reload}
          />
        ))}
      </div>
    </div>
  );
}
