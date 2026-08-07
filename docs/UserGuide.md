# VisionEdge — Frontend User Guide

Owner: Member 06 — Frontend, QA & Deployment Engineer
Area: `frontend/`, `tests/`, `docs/`

## What this dashboard is

A React "monitoring wall" for the VisionEdge edge-AI pipeline. It shows one
tile per camera stream (up to the project's 10-stream target), each with:

- A live decoded frame with detection boxes drawn on top
- A per-camera connection badge (`LINKING` / `LIVE` / `SIGNAL LOST`)
- FPS and end-to-end latency for that stream
- A global pipeline ticker showing occupancy across the four zero-copy
  stages: **Decode → Infer → Draw → Encode/WebRTC**

Clicking a tile opens the **inspector** panel on the right with stream
detail (camera ID, model, decoder, transport).

## Running it locally

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

The dev server proxies `/api` and `/ws` to `http://localhost:8000`, where
Member 01/05's FastAPI + signaling backend is expected to run.

## Running the test suite

```bash
npm test          # one-shot run (CI mode)
npm run test:watch
```

Current coverage: camera grid rendering, tile selection/accessibility
(`aria-pressed`), and the pipeline ticker's stage labels and stream count.
Add new tests alongside any new component in `tests/`.

## Connecting real data (handoff point for Members 03/04/05)

Everything currently runs on **simulated data** so the dashboard can be
built and demoed independently of the GPU backend. The swap-in points are:

1. **Per-camera stats & boxes** — `src/hooks/useSimulatedStream.js`.
   Replace the internal `setInterval` with a subscription to the real
   WebSocket channel, e.g.:

   ```js
   const ws = new WebSocket(`${WS_BASE}/ws/stats/${cameraId}`);
   ws.onmessage = (evt) => setStats(JSON.parse(evt.data));
   ```

   Keep the same return shape (`status`, `fps`, `latencyMs`, `boxes`,
   `gpuMemPct`, `decoderUtilPct`) and no other component needs to change.

2. **Camera roster** — `src/data/mockCameras.js`. Replace with a fetch to
   `GET /api/cameras`, sourced from `backend/configs/cameras.yaml`.

3. **Video frame** — `CameraTile.jsx` currently draws a placeholder
   gradient. Once WebRTC is live, attach the incoming `MediaStream` to a
   `<video>` element and draw only the bounding-box overlay on the
   `<canvas>` positioned on top of it.

4. **Pipeline ticker** — `PipelineTicker.jsx`. Point it at
   `GET/WS /api/telemetry` for real Decode/Infer/Draw/Encode occupancy.

## Deployment

```bash
docker build -t visionedge-frontend .
docker run -p 8080:80 visionedge-frontend
```

`nginx.conf` serves the built static app and reverse-proxies `/api/*` and
`/ws/*` to a `backend` service — matching the `docker-compose.yml` service
name at the project root. Add this service block to that compose file:

```yaml
frontend:
  build: ./frontend
  ports:
    - "8080:80"
  depends_on:
    - backend
```

## Accessibility & QA notes

- Every tile is a real `<button>` with `aria-pressed`, so it's keyboard
  operable and screen-reader friendly.
- Focus states use `:focus-visible` (see `src/index.css`) rather than
  suppressing the browser outline.
- `prefers-reduced-motion` is respected globally — the scanline overlay and
  pulse animation are static, not disabled entirely, when that's set.
- Known gap to track before final review: no live `<video>` element yet
  (pending WebRTC integration), and no error boundary around `CameraTile`
  in case a malformed stats payload arrives — add one when wiring in real
  data.
