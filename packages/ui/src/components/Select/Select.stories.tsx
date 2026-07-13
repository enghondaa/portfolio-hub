import type { Meta, StoryObj } from "@storybook/react";
import { Select } from "./Select";

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  args: {
    label: "Metric",
    options: [
      { value: "attendance", label: "Attendance" },
      { value: "grades", label: "Grades" },
      { value: "wellbeing", label: "Wellbeing" },
    ],
  },
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {};
export const WithError: Story = { args: { error: "Pick a metric to continue." } };
