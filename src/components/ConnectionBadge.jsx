const LABEL = {
  connecting: "LINKING",
  live: "LIVE",
  lost: "SIGNAL LOST"
};

const COLOR = {
  connecting: "var(--amber)",
  live: "var(--phosphor)",
  lost: "var(--red-alert)"
};

export default function ConnectionBadge({ status }) {
  return (
    <span
      className="connection-badge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        color: COLOR[status],
        fontSize: "11px",
        letterSpacing: "0.08em",
        fontWeight: 600
      }}
      role="status"
      aria-label={`Camera status: ${LABEL[status]}`}
    >
      <span
        aria-hidden="true"
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: COLOR[status],
          boxShadow: status === "live" ? `0 0 6px ${COLOR[status]}` : "none",
          animation: status === "connecting" ? "pulse 1s infinite" : "none"
        }}
      />
      {LABEL[status]}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </span>
  );
}
