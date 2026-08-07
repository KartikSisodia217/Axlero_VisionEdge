import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CameraGrid from "../src/components/CameraGrid.jsx";

const cameras = [
  { id: "cam-01", name: "5th & Main", intersection: "Downtown Core", targetFps: 60 },
  { id: "cam-02", name: "Harbor Rd", intersection: "Harbor District", targetFps: 60 }
];

describe("CameraGrid", () => {
  it("renders one tile per camera in the roster", () => {
    render(<CameraGrid cameras={cameras} selectedId={null} onSelect={() => {}} />);
    expect(screen.getByText("5th & Main")).toBeInTheDocument();
    expect(screen.getByText("Harbor Rd")).toBeInTheDocument();
  });

  it("shows an acquiring-signal state before a tile connects", () => {
    render(<CameraGrid cameras={cameras} selectedId={null} onSelect={() => {}} />);
    // Every tile starts in "connecting" because connectDelayMs staggers the roster
    expect(screen.getAllByText(/ACQUIRING SIGNAL|NO SIGNAL/i).length).toBeGreaterThan(0);
  });

  it("calls onSelect with the camera id when a tile is clicked", () => {
    const onSelect = vi.fn();
    render(<CameraGrid cameras={cameras} selectedId={null} onSelect={onSelect} />);
    screen.getByText("5th & Main").closest("button").click();
    expect(onSelect).toHaveBeenCalledWith("cam-01");
  });

  it("marks the selected tile as pressed for accessibility", () => {
    render(<CameraGrid cameras={cameras} selectedId="cam-02" onSelect={() => {}} />);
    const buttons = screen.getAllByRole("button");
    const selected = buttons.find((b) => b.getAttribute("aria-pressed") === "true");
    expect(selected).toBeDefined();
    expect(selected).toHaveTextContent("Harbor Rd");
  });
});
