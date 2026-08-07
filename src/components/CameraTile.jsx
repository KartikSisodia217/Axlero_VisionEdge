import { useEffect, useRef } from "react";
import { useSimulatedStream } from "../hooks/useSimulatedStream.js";
import ConnectionBadge from "./ConnectionBadge.jsx";

export default function CameraTile({ camera, connectDelayMs, onSelect, selected }) {
  const canvasRef = useRef(null);
  const { status, fps, latencyMs, boxes } = useSimulatedStream({
    id: camera.id,
    targetFps: camera.targetFps,
    connectDelayMs
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    // jsdom (used in tests) has no real canvas backend — skip drawing there.
    if (!ctx) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    // Simulated decoded frame background (stands in for the NVDEC output)
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#0d1a12");
    gradient.addColorStop(1, "#132018");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (status !== "live") return;

    boxes.forEach((box) => {
      const x = box.x * width;
      const y = box.y * height;
      const w = box.w * width;
      const h = box.h * height;
      ctx.strokeStyle = box.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
      ctx.fillStyle = box.color;
      ctx.font = "10px 'IBM Plex Mono', monospace";
      const label = `${box.label} ${(box.confidence * 100).toFixed(0)}%`;
      const textWidth = ctx.measureText(label).width;
      ctx.fillRect(x, y - 13, textWidth + 6, 13);
      ctx.fillStyle = "#0a0f0c";
      ctx.fillText(label, x + 3, y - 3);
    });
  }, [boxes, status]);

  return (
    <button
      onClick={() => onSelect(camera.id)}
      aria-pressed={selected}
      className="camera-tile"
      style={{
        position: "relative",
        border: selected ? "1px solid var(--phosphor)" : "1px solid var(--grid-line)",
        background: "var(--panel)",
        borderRadius: "var(--radius)",
        padding: 0,
        overflow: "hidden",
        textAlign: "left",
        color: "inherit",
        boxShadow: selected ? "0 0 0 1px var(--phosphor-glow) inset" : "none"
      }}
    >
      <div style={{ position: "relative", aspectRatio: "16 / 9", background: "#050705" }}>
        <canvas
          ref={canvasRef}
          width={320}
          height={180}
          style={{ width: "100%", height: "100%", display: "block" }}
        />
        {status !== "live" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              color: "var(--text-muted)",
              letterSpacing: "0.06em"
            }}
          >
            {status === "connecting" ? "ACQUIRING SIGNAL…" : "NO SIGNAL"}
          </div>
        )}
        {/* Scanline overlay — the CRT/phosphor signature texture for this feed */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0px, rgba(0,0,0,0.18) 1px, transparent 1px, transparent 3px)"
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 8,
            right: 8,
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "var(--text-muted)"
          }}
        >
          <span>{camera.id.toUpperCase()}</span>
          <ConnectionBadge status={status} />
        </div>
      </div>
      <div style={{ padding: "8px 10px" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 600 }}>
          {camera.name}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 4,
            fontSize: 11,
            color: "var(--text-muted)"
          }}
        >
          <span>{camera.intersection}</span>
          <span style={{ color: fps >= camera.targetFps - 3 ? "var(--phosphor)" : "var(--amber)" }}>
            {status === "live" ? `${fps} FPS · ${latencyMs}ms` : "—"}
          </span>
        </div>
      </div>
    </button>
  );
}
