import type { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Components/Footer",
  component: Footer,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    copyright: "© 2026 Mohand Elshahawy",
    links: [
      { href: "#", label: "GitHub" },
      { href: "#", label: "LinkedIn" },
      { href: "#", label: "Back to hub" },
    ],
  },
};
