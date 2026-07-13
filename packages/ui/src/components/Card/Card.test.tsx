import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./Card";

describe("Card", () => {
  it("renders composed sub-components", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Task Board</CardTitle>
          <CardDescription>MERN demo</CardDescription>
        </CardHeader>
        <CardContent>Body content</CardContent>
      </Card>
    );

    expect(screen.getByRole("heading", { name: "Task Board" })).toBeInTheDocument();
    expect(screen.getByText("MERN demo")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("applies emphasized styling when requested", () => {
    render(<Card emphasized data-testid="card" />);
    expect(screen.getByTestId("card").className).toContain("shadow-sm");
  });
});
