export function HubProgress({
  spent,
  limit
}: {
  spent: number;
  limit: number;
}) {
  const percent = Math.min((spent / limit) * 100, 100);

  return (
    <div>
      <div className="muted">Orçamento usado</div>
      <div
        style={{
          background: "#020617",
          borderRadius: 10,
          overflow: "hidden",
          marginTop: 6
        }}
      >
        <div
          style={{
            height: 12,
            width: `${percent}%`,
            background:
              percent < 70
                ? "var(--primary)"
                : percent < 90
                ? "#f59e0b"
                : "var(--danger)",
            transition: "width .4s ease"
          }}
        />
      </div>

      <small className="muted">
        R$ {spent} / R$ {limit}
      </small>
    </div>
  );
}
