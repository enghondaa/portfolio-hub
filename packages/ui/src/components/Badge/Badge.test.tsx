import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its label", () => {
    render(<Badge>Demo data</Badge>);
    expect(screen.getByText("Demo data")).toBeInTheDocument();
  });

  it("applies the tone class", () => {
    render(<Badge tone="success">Live</Badge>);
    expect(screen.getByText("Live").className).toContain("emerald");
  });
});
