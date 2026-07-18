/**
 * @jest-environment node
 */
import { memoryStore } from "@/lib/store";
import type { ColumnId } from "@/lib/types";

async function idsIn(column: ColumnId): Promise<string[]> {
  const all = await memoryStore.list();
  return all
    .filter((t) => t.column === column)
    .sort((a, b) => a.position - b.position)
    .map((t) => t.id);
}

describe("memoryStore", () => {
  it("seeds a board across all three columns", async () => {
    const tasks = await memoryStore.list();
    expect(tasks.length).toBeGreaterThan(0);
    expect(new Set(tasks.map((t) => t.column))).toEqual(new Set(["todo", "in_progress", "done"]));
  });

  it("appends a created task to the end of its column", async () => {
    const before = await idsIn("todo");
    const created = await memoryStore.create({
      title: "New task",
      description: "",
      column: "todo",
      priority: "low",
    });

    expect(created.position).toBe(before.length);
    expect(await idsIn("todo")).toEqual([...before, created.id]);
  });

  it("returns null when updating an id that does not exist", async () => {
    expect(await memoryStore.update("no-such-id", { column: "done" })).toBeNull();
  });

  it("moves a task to the end of the target column when no position is given", async () => {
    const created = await memoryStore.create({
      title: "Moves columns",
      description: "",
      column: "todo",
      priority: "low",
    });
    const doneCount = (await idsIn("done")).length;

    const updated = await memoryStore.update(created.id, { column: "done" });

    expect(updated?.column).toBe("done");
    expect(updated?.position).toBe(doneCount);
  });

  it("rewrites positions to match the supplied order on reorder", async () => {
    const original = await idsIn("todo");
    const reversed = [...original].reverse();

    const result = await memoryStore.reorder("todo", reversed);

    expect(result.map((t) => t.id)).toEqual(reversed);
    expect(result.map((t) => t.position)).toEqual(reversed.map((_, i) => i));
  });

  it("reports whether a delete actually removed anything", async () => {
    const created = await memoryStore.create({
      title: "Temporary",
      description: "",
      column: "todo",
      priority: "low",
    });

    expect(await memoryStore.remove(created.id)).toBe(true);
    expect(await memoryStore.remove(created.id)).toBe(false);
  });
});
