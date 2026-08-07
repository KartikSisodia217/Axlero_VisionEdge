// This roster mirrors what backend/configs/cameras.yaml will eventually provide
// over the FastAPI /api/cameras endpoint. Swap useSimulatedStream for a real
// WebRTC/WebSocket subscription (see docs/UserGuide.md) once Member 05's
// signaling server and Member 04's zero-copy pipeline are live.

export const CAMERAS = [
  { id: "cam-01", name: "5th & Main", intersection: "Downtown Core", targetFps: 60 },
  { id: "cam-02", name: "Harbor Rd / Pier Ave", intersection: "Harbor District", targetFps: 60 },
  { id: "cam-03", name: "Elm St Overpass", intersection: "North Ring", targetFps: 60 },
  { id: "cam-04", name: "Station Plaza", intersection: "Transit Hub", targetFps: 60 },
  { id: "cam-05", name: "Riverside & 12th", intersection: "Riverside", targetFps: 60 },
  { id: "cam-06", name: "Industrial Loop W", intersection: "West Industrial", targetFps: 60 },
  { id: "cam-07", name: "Market Square", intersection: "Downtown Core", targetFps: 60 },
  { id: "cam-08", name: "Airport Access Rd", intersection: "South Corridor", targetFps: 60 },
  { id: "cam-09", name: "University Gate", intersection: "Campus", targetFps: 60 },
  { id: "cam-10", name: "Stadium Roundabout", intersection: "East Loop", targetFps: 60 }
];

export const DETECTION_CLASSES = [
  { label: "car", color: "#5ffb9a" },
  { label: "truck", color: "#ffb454" },
  { label: "bus", color: "#7fd7ff" },
  { label: "person", color: "#ff8fd0" },
  { label: "bicycle", color: "#c8ff5f" }
];
