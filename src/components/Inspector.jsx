export default function Inspector({ camera }) {
  if (!camera) {
    return (
      <aside style={panelStyle}>
        <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
          Select a tile to inspect stream detail.
        </p>
      </aside>
    );
  }

  return (
    <aside style={panelStyle}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: 15, margin: "0 0 4px" }}>
        {camera.name}
      </h2>
      <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>{camera.intersection}</p>

      <dl style={dlStyle}>
        <Row label="Camera ID" value={camera.id} />
        <Row label="Target FPS" value={`${camera.targetFps}`} />
        <Row label="Decoder" value="NVDEC (H.264/H.265)" />
        <Row label="Model" value="YOLOv10 → TensorRT engine" />
        <Row label="Transport" value="WebRTC (aiortc), sub-100ms" />
      </dl>

      <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 16 }}>
        Stats shown across this dashboard are simulated pending the live
        WebSocket telemetry feed from the streaming backend. See
        docs/UserGuide.md to wire in the real feed.
      </p>
    </aside>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px dashed var(--grid-line)" }}>
      <dt style={{ fontSize: 11, color: "var(--text-muted)" }}>{label}</dt>
      <dd style={{ fontSize: 11, margin: 0 }}>{value}</dd>
    </div>
  );
}

const panelStyle = {
  width: 260,
  padding: 16,
  borderLeft: "1px solid var(--grid-line)",
  background: "var(--panel)"
};

const dlStyle = { margin: "12px 0 0" };
