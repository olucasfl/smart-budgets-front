type Props = {
  spent: number;
  limit: number;
};

export function HubProgressMini({ spent, limit }: Props) {
  const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;

  const color =
    percent < 70
      ? "var(--primary)"
      : percent < 90
      ? "#f59e0b"
      : "var(--danger)";

  return (
    <div style={{ marginTop: 12 }}>
      <div
        style={{
          height: 8,
          background: "#020617",
          borderRadius: 8,
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: color,
            transition: "width .4s ease"
          }}
        />
      </div>

      <small className="muted">
        R$ {spent.toFixed(2)} / R$ {limit.toFixed(2)}
      </small>
    </div>
  );
}
