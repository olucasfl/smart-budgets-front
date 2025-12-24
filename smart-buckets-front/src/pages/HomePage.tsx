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
    <div className="container fade-in">
      {/* Header */}
      <div className="page-header">
        <h1>Smart Buckets</h1>

        <button
          className="primary"
          onClick={() => setShowForm(prev => !prev)}
        >
          {showForm ? "Cancelar" : "Criar Hub"}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <HubForm
            onSaved={() => {
              setShowForm(false);
              load();
            }}
          />
        </div>
      )}

      {/* Loading */}
      {loading && <p>Carregando hubs...</p>}

      {/* Empty state */}
      {!loading && hubs.length === 0 && (
        <div className="card muted center">
          <p>Nenhum hub criado ainda.</p>
          <small>Crie um hub para começar a organizar seus gastos.</small>
        </div>
      )}

      {/* Cards */}
      <div className="grid">
        {hubs.map(hub => (
          <HubCard
            key={hub.id}
            hub={hub}
            onDeleted={load}
          />
        ))}
      </div>
    </div>
  );
}
