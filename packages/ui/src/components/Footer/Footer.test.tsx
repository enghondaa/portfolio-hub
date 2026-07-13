import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders the copyright text", () => {
    render(<Footer copyright="© 2026 Mohand Elshahawy" />);
    expect(screen.getByText("© 2026 Mohand Elshahawy")).toBeInTheDocument();
  });

  it("renders footer links in a labeled nav landmark", () => {
    render(
      <Footer
        copyright="© 2026"
        links={[{ href: "/hub", label: "Back to hub" }]}
      />
    );
    expect(screen.getByRole("navigation", { name: "Footer" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to hub" })).toBeInTheDocument();
  });
});
