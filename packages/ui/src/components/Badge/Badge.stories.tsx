import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Components/Badge",
  component: Badge,
  args: { children: "Demo data" },
  argTypes: {
    tone: { control: "select", options: ["neutral", "accent", "success", "warning"] },
  },
};
export default meta;

type Story = StoryObj<typeof Badge>;

export const Neutral: Story = { args: { tone: "neutral" } };
export const Accent: Story = { args: { tone: "accent" } };
export const Success: Story = { args: { tone: "success", children: "Deployed" } };
export const Warning: Story = { args: { tone: "warning", children: "Seeded data" } };
