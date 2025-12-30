import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { hubService } from "../services/hubService";
import type { HubDetailResponse } from "../dtos/HubDetailResponse";
import ExpenseForm from "../components/expense/ExpenseForm";
import ExpenseItem from "../components/expense/ExpenseItem";
import { HubProgress } from "../components/hub/HubProgress";
import { ExpensesByDateChart, ExpensesByTypeChart } from "../components/charts";

const TYPES = ["PIX", "CREDIT", "DEBIT", "MONEY"] as const;

export function HubDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const hubId = Number(id);

  const [hub, setHub] = useState<HubDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [activeInsight, setActiveInsight] = useState(0);

  // 🔎 filtros
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [typeFilter, setTypeFilter] = useState<Record<string, boolean>>({
    PIX: true,
    CREDIT: true,
    DEBIT: true,
    MONEY: true
  });

  const load = async () => {
    setLoading(true);
    const res = await hubService.findDetail(hubId);
    setHub(res.data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // 🔥 FILTRO FINAL (SEM BUG DE DATA)
  const filteredExpenses = useMemo(() => {
    if (!hub) return [];

    return hub.expenses
      // nome
      .filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase())
      )
      // tipo
      .filter(e => typeFilter[e.type])
      // data exata (dia inteiro)
      .filter(e => {
        if (!selectedDate) return true;

        const expenseDate = new Date(e.createAt);
        const [year, month, day] = selectedDate.split("-").map(Number);

        return (
          expenseDate.getFullYear() === year &&
          expenseDate.getMonth() === month - 1 &&
          expenseDate.getDate() === day
        );
      });
  }, [hub, search, typeFilter, selectedDate]);

  if (loading || !hub) {
    return (
      <div className="container">
        <p className="muted">Carregando hub...</p>
      </div>
    );
  }

  const totalSpent = filteredExpenses.reduce(
    (sum, e) => sum + e.amount,
    0
  );
  const remaining = hub.budgetLimit - totalSpent;

  return (
    <div className="container fade-in">

      {/* HEADER */}
      <div className="hub-header-detail">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Voltar
        </button>

        <div className="hub-title-center">
          <h1>{hub.name}</h1>
          <p className="muted">
            {hub.description || "Sem descrição"}
          </p>
        </div>
      </div>

      {/* ORÇAMENTO */}
      <div className="card">
        <HubProgress spent={totalSpent} limit={hub.budgetLimit} />

        <div className="budget-info">
          <span>
            Limite: <strong>R$ {hub.budgetLimit.toFixed(2)}</strong>
          </span>
          <span>
            Gasto: <strong>R$ {totalSpent.toFixed(2)}</strong>
          </span>
          <span
            className={remaining < 0 ? "danger-text" : "success-text"}
          >
            Saldo: R$ {remaining.toFixed(2)}
          </span>
        </div>
      </div>

      <h2 style={{ marginTop: 36 }}>Despesas</h2>

      <div className="card filters-card" style={{ marginTop: 16 }}>
        <div className="filters-grid">

          {/* BUSCA */}
          <div className="filter-group">
            <label>Buscar despesa</label>
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* DATA */}
          <div className="filter-group">
            <label>Filtrar por dia</label>
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
            />
          </div>

          {/* TIPOS */}
          <div className="filter-group full">
            <label>Tipos de pagamento</label>

            <div className="type-filters">
              {TYPES.map(type => (
                <label
                  key={type}
                  className={`type-pill ${typeFilter[type] ? "active" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={typeFilter[type]}
                    onChange={() =>
                      setTypeFilter(prev => ({
                        ...prev,
                        [type]: !prev[type]
                      }))
                    }
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* BOTÃO */}
      <div style={{ marginTop: 24 }}>
        <button
          className="primary"
          onClick={() => setShowExpenseForm(p => !p)}
        >
          + Nova Despesa
        </button>
      </div>

      {showExpenseForm && (
        <ExpenseForm hubId={hubId} onSaved={load} />
      )}

      {/* LISTA COM SCROLL (SÓ AS DESPESAS AQUI) */}
      <div className="expenses-scroll">
        {filteredExpenses.length === 0 && (
        <p className="muted">Nenhuma despesa encontrada.</p>
      )}

        {filteredExpenses.map(expense => (
      <ExpenseItem
      key={expense.id}
      expense={expense}
      hubId={hubId}
      onDeleted={load}
        />
        ))}
    </div>

      {/* ANALYTICS */}
      <h2 style={{ marginTop: 36 }}>Analytics</h2>

      <div className="insights-card">
        <button
          className="insight-arrow"
          onClick={() => setActiveInsight(p => Math.max(p - 1, 0))}
        >
          ◀
        </button>

        <div className="insight-content">
          {activeInsight === 0 && (
            <ExpensesByTypeChart expenses={filteredExpenses} />
          )}
          {activeInsight === 1 && (
            <ExpensesByDateChart expenses={filteredExpenses} />
          )}
        </div>

        <button
          className="insight-arrow"
          onClick={() => setActiveInsight(p => Math.min(p + 1, 1))}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
