import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "./Navbar";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";

const meta: Meta<typeof Navbar> = {
  title: "Components/Navbar",
  component: Navbar,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  args: {
    brand: "Mohand Elshahawy",
    links: [
      { href: "#", label: "Projects" },
      { href: "#", label: "About" },
      { href: "#", label: "Contact" },
    ],
  },
  render: (args) => <Navbar {...args} actions={<ThemeToggle />} />,
};
