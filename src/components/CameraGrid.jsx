import CameraTile from "./CameraTile.jsx";

export default function CameraGrid({ cameras, selectedId, onSelect }) {
  return (
    <div
      role="grid"
      aria-label="Live camera streams"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "12px",
        padding: "16px"
      }}
    >
      {cameras.map((camera, i) => (
        <CameraTile
          key={camera.id}
          camera={camera}
          connectDelayMs={i * 220}
          selected={camera.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
