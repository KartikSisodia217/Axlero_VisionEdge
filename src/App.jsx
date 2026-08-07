import { useState } from "react";
import Header from "./components/Header.jsx";
import PipelineTicker from "./components/PipelineTicker.jsx";
import CameraGrid from "./components/CameraGrid.jsx";
import Inspector from "./components/Inspector.jsx";
import { CAMERAS } from "./data/mockCameras.js";

export default function App() {
  const [selectedId, setSelectedId] = useState(null);
  const selectedCamera = CAMERAS.find((c) => c.id === selectedId) ?? null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ padding: "12px 16px 0" }}>
        <PipelineTicker streamCount={CAMERAS.length} />
      </div>
      <main style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div style={{ flex: 1, overflowY: "auto" }}>
          <CameraGrid cameras={CAMERAS} selectedId={selectedId} onSelect={setSelectedId} />
        </div>
        <Inspector camera={selectedCamera} />
      </main>
    </div>
  );
}
