import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";

const tabs = [
  { id: "overview", label: "Overview", content: <p>Overview content</p> },
  { id: "details", label: "Details", content: <p>Details content</p> },
  { id: "history", label: "History", content: <p>History content</p> },
];

describe("Tabs", () => {
  it("shows the first tab's panel by default", () => {
    render(<Tabs tabs={tabs} />);
    expect(screen.getByText("Overview content")).toBeVisible();
    expect(screen.getByText("Details content")).not.toBeVisible();
  });

  it("switches panels on click", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} />);
    await user.click(screen.getByRole("tab", { name: "Details" }));
    expect(screen.getByText("Details content")).toBeVisible();
  });

  it("moves selection with ArrowRight/ArrowLeft and wraps around", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} />);

    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    overviewTab.focus();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Details" })).toHaveFocus();
    expect(screen.getByRole("tab", { name: "Details" })).toHaveAttribute("aria-selected", "true");

    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "History" })).toHaveFocus();
  });

  it("jumps to the last tab on End", async () => {
    const user = userEvent.setup();
    render(<Tabs tabs={tabs} />);
    screen.getByRole("tab", { name: "Overview" }).focus();
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "History" })).toHaveAttribute("aria-selected", "true");
  });
});
