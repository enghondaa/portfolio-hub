import { render, screen } from "@testing-library/react";
import { Table, type TableColumn } from "./Table";

interface Row {
  id: string;
  name: string;
  score: number;
}

const columns: TableColumn<Row>[] = [
  { key: "name", header: "Name", render: (row) => row.name },
  { key: "score", header: "Score", render: (row) => row.score, align: "right" },
];

const data: Row[] = [
  { id: "1", name: "Attendance", score: 92 },
  { id: "2", name: "Grades", score: 88 },
];

describe("Table", () => {
  it("renders a header row and one row per data item", () => {
    render(<Table columns={columns} data={data} getRowId={(row) => row.id} />);
    expect(screen.getByRole("columnheader", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Attendance" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Grades" })).toBeInTheDocument();
  });

  it("shows the empty message when there is no data", () => {
    render(<Table columns={columns} data={[]} getRowId={(row) => row.id} emptyMessage="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders an accessible caption when provided", () => {
    render(
      <Table columns={columns} data={data} getRowId={(row) => row.id} caption="Weekly metrics" />
    );
    expect(screen.getByText("Weekly metrics")).toBeInTheDocument();
  });
});
