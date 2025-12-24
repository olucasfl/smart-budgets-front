import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { hubService } from "../../services/hubService";
import type { HubSummaryResponse } from "../../dtos/HubSummaryResponse";
import type { HubDetailResponse } from "../../dtos/HubDetailResponse";

export function HubCard({
  hub,
  onDeleted
}: {
  hub: HubSummaryResponse;
  onDeleted: () => void;
}) {
  const navigate = useNavigate();
  const [detail, setDetail] = useState<HubDetailResponse | null>(null);

  useEffect(() => {
    hubService.findDetail(hub.id).then(res => setDetail(res.data));
  }, [hub.id]);

  const totalSpent =
    detail?.expenses.reduce((sum, e) => sum + e.amount, 0) ?? 0;

  const percent =
    hub.budgetLimit > 0
      ? Math.min((totalSpent / hub.budgetLimit) * 100, 100)
      : 0;

  const progressColor =
    percent < 60 ? "green" : percent < 85 ? "yellow" : "red";

  return (
    <div className="hub-card">
      {/* Header */}
      <div className="hub-header">
        <h2>{hub.name}</h2>
      </div>

      {/* Barra de progresso */}
      <div className="progress-wrapper">
        <div className="progress-bar">
          <div
            className={`progress ${progressColor}`}
            style={{ width: `${percent}%` }}
          />
        </div>

      </div>

      {/* Ações */}
      <div className="hub-actions">
        <button
          className="primary"
          onClick={() => navigate(`/hub/${hub.id}`)}
        >
          Entrar
        </button>

        <button
          className="danger"
          onClick={() =>
            hubService.delete(hub.id).then(onDeleted)
          }
        >
          Excluir
        </button>
      </div>
    </div>
  );
}
