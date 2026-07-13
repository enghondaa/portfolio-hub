import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("associates the label with the input for accessible name", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("accepts typed input", async () => {
    const user = userEvent.setup();
    render(<Input label="Email" />);
    const input = screen.getByLabelText("Email");
    await user.type(input, "mohand@example.com");
    expect(input).toHaveValue("mohand@example.com");
  });

  it("marks the input invalid and announces the error", () => {
    render(<Input label="Email" error="Email is required" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Email is required")).toBeInTheDocument();
  });

  it("shows helper text when there is no error", () => {
    render(<Input label="Email" helperText="We never share this" />);
    expect(screen.getByText("We never share this")).toBeInTheDocument();
  });
});
