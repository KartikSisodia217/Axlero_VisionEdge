import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PipelineTicker from "../src/components/PipelineTicker.jsx";

describe("PipelineTicker", () => {
  it("renders all four zero-copy pipeline stages", () => {
    render(<PipelineTicker streamCount={4} />);
    ["DECODE", "INFER", "DRAW", "ENCODE / WEBRTC"].forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  it("displays the active stream count against the 10-stream target", () => {
    render(<PipelineTicker streamCount={4} />);
    expect(screen.getByText("4 / 10")).toBeInTheDocument();
  });
});
