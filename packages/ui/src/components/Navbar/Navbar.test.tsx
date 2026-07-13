import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Navbar } from "./Navbar";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

describe("Navbar", () => {
  it("renders the brand and links", () => {
    render(<Navbar brand="Mohand Elshahawy" links={links} />);
    expect(screen.getByText("Mohand Elshahawy")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Projects" }).length).toBeGreaterThan(0);
  });

  it("toggles the mobile menu and announces state via aria-expanded", async () => {
    const user = userEvent.setup();
    render(<Navbar brand="Mohand" links={links} />);

    const menuButton = screen.getByRole("button", { name: "Open menu" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    await user.click(menuButton);
    expect(screen.getByRole("button", { name: "Close menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });

  it("closes the mobile menu after a link is clicked", async () => {
    const user = userEvent.setup();
    render(<Navbar brand="Mohand" links={links} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const mobileLinks = screen.getAllByRole("link", { name: "About" });
    const lastLink = mobileLinks.at(-1);
    expect(lastLink).toBeDefined();
    await user.click(lastLink!);
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });
});
