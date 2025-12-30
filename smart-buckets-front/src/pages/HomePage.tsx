import { useEffect, useState } from "react";
import { hubService } from "../services/hubService";
import type { HubSummaryResponse } from "../dtos/HubSummaryResponse";
import { HubCard } from "../components/hub/HubCard";
import { HubForm } from "../components/hub/HubForm";

export function HomePage() {
  const [hubs, setHubs] = useState<HubSummaryResponse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await hubService.listSummary();
      setHubs(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="home-wrapper fade-in">
      {/* ================= HEADER ================= */}
      <header className="home-hero">
        <div className="home-hero-text">
          <h1>Smart Buckets</h1>
          <p>
            Organize seus gastos por hubs de forma
            <span> inteligente</span>
          </p>
        </div>

        <button
          className="cta-primary"
          onClick={() => setShowForm(p => !p)}
        >
          {showForm ? "Cancelar" : "+ Criar Hub"}
        </button>
      </header>

      {/* ================= CREATE HUB ================= */}
      {showForm && (
        <section className="create-hub-glass">
          <HubForm
            onSaved={() => {
              setShowForm(false);
              load();
            }}
          />
        </section>
      )}

      {/* ================= CONTENT ================= */}
      <section className="home-content">
        {loading && (
          <p className="muted">Carregando hubs...</p>
        )}

        {!loading && hubs.length === 0 && (
          <div className="empty-glass">
            <h3>Nenhum hub criado</h3>
            <p>
              Crie seu primeiro hub e comece a
              organizar seus gastos agora.
            </p>
          </div>
        )}

        {!loading && hubs.length > 0 && (
          <div className="hub-grid-modern">
            {hubs.map(hub => (
              <HubCard
                key={hub.id}
                hub={hub}
                onDeleted={load}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
