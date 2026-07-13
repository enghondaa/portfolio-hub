import type { Meta, StoryObj } from "@storybook/react";
import { Table, type TableColumn } from "./Table";

interface Row {
  id: string;
  metric: string;
  value: number;
}

const columns: TableColumn<Row>[] = [
  { key: "metric", header: "Metric", render: (row) => row.metric },
  { key: "value", header: "Value", render: (row) => row.value, align: "right" },
];

const data: Row[] = [
  { id: "1", metric: "Attendance", value: 92 },
  { id: "2", metric: "Avg. grade", value: 88 },
  { id: "3", metric: "Wellbeing score", value: 76 },
];

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
};
export default meta;

type Story = StoryObj<typeof Table<Row>>;

export const Default: Story = {
  args: { columns, data, getRowId: (row) => row.id, caption: "Demo school metrics" },
};

export const Empty: Story = {
  args: { columns, data: [], getRowId: (row) => row.id },
};
