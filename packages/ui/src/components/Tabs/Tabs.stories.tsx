import type { Meta, StoryObj } from "@storybook/react";
import { Tabs } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    tabs: [
      { id: "overview", label: "Overview", content: <p>Case study overview text.</p> },
      { id: "stack", label: "Stack", content: <p>Next.js, TypeScript, Tailwind CSS.</p> },
      { id: "results", label: "Results", content: <p>45% faster load times.</p> },
    ],
  },
};
