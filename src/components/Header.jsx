import { useEffect, useState } from "react";

export default function Header() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 16px",
        borderBottom: "1px solid var(--grid-line)"
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--font-display)",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: "0.03em",
            color: "var(--phosphor)"
          }}
        >
          VISIONEDGE
        </h1>
        <span style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.06em" }}>
          MONITORING WALL
        </span>
      </div>
      <div style={{ fontSize: 12, color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>
        {now.toLocaleTimeString([], { hour12: false })}
      </div>
    </header>
  );
}
