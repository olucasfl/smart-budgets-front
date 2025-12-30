type HubProgressProps = {
  spent: number;
  limit: number;
};

export function HubProgress({ spent, limit }: HubProgressProps) {
  const percentage = Math.min((spent / limit) * 100, 100);

  return (
    <div className="hub-progress">
      <div className="hub-progress-track">
        <div
          className="hub-progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="hub-progress-label">
        R$ {spent.toFixed(2)} / R$ {limit.toFixed(2)}
      </div>
    </div>
  );
}
