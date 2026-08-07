import { useEffect, useRef, useState } from "react";
import { DETECTION_CLASSES } from "../data/mockCameras.js";

/**
 * Simulates the telemetry that will eventually arrive over the WebRTC data
 * channel / WebSocket signaling path built by Member 05 (Backend & Streaming
 * Engineer), carrying stats produced by Member 03/04's inference + GPU
 * pipeline. Replace the interval below with a subscription to that channel:
 *
 *   const ws = new WebSocket(`${WS_BASE}/ws/stats/${cameraId}`);
 *   ws.onmessage = (evt) => setStats(JSON.parse(evt.data));
 *
 * Keeping the exact same return shape ({ status, fps, latencyMs, boxes,
 * gpuMemPct, decoderUtilPct }) means every component below needs zero
 * changes when the real feed is wired in.
 */
export function useSimulatedStream({ id, targetFps = 60, connectDelayMs = 0 }) {
  const [status, setStatus] = useState("connecting");
  const boxesRef = useRef(spawnBoxes());
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const connectTimer = setTimeout(() => setStatus("live"), connectDelayMs);
    return () => clearTimeout(connectTimer);
  }, [connectDelayMs]);

  useEffect(() => {
    if (status !== "live") return;
    const interval = setInterval(() => {
      boxesRef.current = stepBoxes(boxesRef.current);
      setTick((t) => t + 1);
    }, 1000 / 12); // 12 Hz UI refresh is plenty for a dashboard preview
    return () => clearInterval(interval);
  }, [status]);

  const jitter = (Math.sin(tick / 9 + id.length) + 1) / 2; // smooth 0..1 wander
  const fps = status === "live" ? Math.round(targetFps - jitter * 4) : 0;
  const latencyMs = status === "live" ? Math.round(38 + jitter * 25) : 0;
  const gpuMemPct = status === "live" ? Math.round(52 + jitter * 18) : 0;
  const decoderUtilPct = status === "live" ? Math.round(60 + (1 - jitter) * 22) : 0;

  return {
    status,
    fps,
    latencyMs,
    gpuMemPct,
    decoderUtilPct,
    boxes: status === "live" ? boxesRef.current : []
  };
}

function spawnBoxes() {
  const count = 2 + Math.floor(Math.random() * 4);
  return Array.from({ length: count }, () => randomBox());
}

function randomBox() {
  const cls = DETECTION_CLASSES[Math.floor(Math.random() * DETECTION_CLASSES.length)];
  return {
    x: Math.random() * 0.7,
    y: Math.random() * 0.7,
    w: 0.1 + Math.random() * 0.15,
    h: 0.1 + Math.random() * 0.15,
    dx: (Math.random() - 0.5) * 0.01,
    dy: (Math.random() - 0.5) * 0.01,
    label: cls.label,
    color: cls.color,
    confidence: 0.7 + Math.random() * 0.29
  };
}

function stepBoxes(boxes) {
  return boxes.map((b) => {
    let x = b.x + b.dx;
    let y = b.y + b.dy;
    let dx = b.dx;
    let dy = b.dy;
    if (x < 0 || x + b.w > 1) dx = -dx;
    if (y < 0 || y + b.h > 1) dy = -dy;
    x = Math.min(Math.max(x, 0), 1 - b.w);
    y = Math.min(Math.max(y, 0), 1 - b.h);
    return { ...b, x, y, dx, dy };
  });
}
