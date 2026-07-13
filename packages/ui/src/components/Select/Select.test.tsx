import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

const options = [
  { value: "attendance", label: "Attendance" },
  { value: "grades", label: "Grades" },
];

describe("Select", () => {
  it("associates the label with the select for accessible name", () => {
    render(<Select label="Metric" options={options} />);
    expect(screen.getByLabelText("Metric")).toBeInTheDocument();
  });

  it("lets keyboard users change the value", async () => {
    const user = userEvent.setup();
    render(<Select label="Metric" options={options} />);
    const select = screen.getByLabelText("Metric") as HTMLSelectElement;
    await user.selectOptions(select, "grades");
    expect(select.value).toBe("grades");
  });

  it("shows an error message when invalid", () => {
    render(<Select label="Metric" options={options} error="Pick a metric" />);
    expect(screen.getByLabelText("Metric")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Pick a metric")).toBeInTheDocument();
  });
});
