import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  args: { label: "Email address", placeholder: "you@example.com" },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const WithHelperText: Story = { args: { helperText: "We never share this." } };
export const WithError: Story = { args: { error: "Enter a valid email address." } };
export const Disabled: Story = { args: { disabled: true, value: "readonly@example.com" } };
