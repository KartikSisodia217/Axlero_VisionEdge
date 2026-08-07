import { useEffect, useState } from "react";

const STAGES = [
  { key: "decode", label: "DECODE", note: "NVDEC · GPU mem" },
  { key: "infer", label: "INFER", note: "TensorRT · YOLOv10" },
  { key: "draw", label: "DRAW", note: "CUDA kernels" },
  { key: "encode", label: "ENCODE / WEBRTC", note: "aiortc · <100ms" }
];

/**
 * A horizontal occupancy strip standing in for the zero-copy pipeline
 * (Decode → Inference → Draw → Encode) — this never touches system RAM in
 * the real backend, so the visual metaphor here is "everything stays on
 * one rail." Values are simulated pending the real /api/telemetry feed.
 */
export default function PipelineTicker({ streamCount }) {
  const [load, setLoad] = useState(STAGES.map(() => 40));

  useEffect(() => {
    const interval = setInterval(() => {
      setLoad((prev) => prev.map((v) => clamp(v + (Math.random() - 0.5) * 14, 25, 95)));
    }, 900);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: "1px",
        background: "var(--grid-line)",
        border: "1px solid var(--grid-line)",
        borderRadius: "var(--radius)",
        overflow: "hidden"
      }}
      role="group"
      aria-label="Zero-copy GPU pipeline occupancy"
    >
      {STAGES.map((stage, i) => (
        <div
          key={stage.key}
          style={{
            flex: 1,
            background: "var(--panel)",
            padding: "8px 12px",
            position: "relative"
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: "0.08em", color: "var(--text-muted)" }}>
            {stage.label}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              fontWeight: 600,
              color: "var(--phosphor)"
            }}
          >
            {Math.round(load[i])}%
          </div>
          <div style={{ fontSize: 9, color: "var(--text-faint)" }}>{stage.note}</div>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              height: 2,
              width: `${load[i]}%`,
              background: "var(--phosphor)",
              boxShadow: "0 0 6px var(--phosphor)",
              transition: "width 0.6s linear"
            }}
          />
          {i < STAGES.length - 1 && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                right: -9,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-faint)",
                fontSize: 12,
                zIndex: 1
              }}
            >
              ›
            </span>
          )}
        </div>
      ))}
      <div
        style={{
          background: "var(--panel-raised)",
          padding: "8px 14px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          minWidth: 110
        }}
      >
        <div style={{ fontSize: 10, letterSpacing: "0.08em", color: "var(--text-muted)" }}>
          STREAMS
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700 }}>
          {streamCount} / 10
        </div>
      </div>
    </div>
  );
}

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}
