import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
};
export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
        <CardDescription>School data visualizations demo</CardDescription>
      </CardHeader>
      <CardContent>D3.js and Chart.js, seeded demo data.</CardContent>
    </Card>
  ),
};

export const Emphasized: Story = {
  args: { emphasized: true },
  render: (args) => (
    <Card {...args} className="max-w-sm">
      <CardHeader>
        <CardTitle>Featured</CardTitle>
        <CardDescription>Emphasized variant</CardDescription>
      </CardHeader>
      <CardContent>Slightly stronger border and shadow.</CardContent>
    </Card>
  ),
};
