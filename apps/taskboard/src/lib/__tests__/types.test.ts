import { createTaskSchema, reorderSchema, updateTaskSchema } from "@/lib/types";

describe("createTaskSchema", () => {
  it("applies defaults for the optional fields", () => {
    const parsed = createTaskSchema.parse({ title: "Ship it" });
    expect(parsed).toEqual({ title: "Ship it", description: "", column: "todo", priority: "medium" });
  });

  it("trims the title and rejects one that is only whitespace", () => {
    expect(createTaskSchema.parse({ title: "  padded  " }).title).toBe("padded");

    const result = createTaskSchema.safeParse({ title: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.title).toContain("Title is required");
    }
  });

  it("rejects a title over 120 characters", () => {
    const result = createTaskSchema.safeParse({ title: "a".repeat(121) });
    expect(result.success).toBe(false);
  });

  it("rejects a priority outside the allowed set", () => {
    expect(createTaskSchema.safeParse({ title: "x", priority: "urgent" }).success).toBe(false);
  });

  it("rejects an unknown column", () => {
    expect(createTaskSchema.safeParse({ title: "x", column: "backlog" }).success).toBe(false);
  });
});

describe("updateTaskSchema", () => {
  it("accepts a single field", () => {
    expect(updateTaskSchema.parse({ column: "done" })).toEqual({ column: "done" });
  });

  it("rejects an empty body, since there would be nothing to update", () => {
    const result = updateTaskSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("rejects a negative position", () => {
    expect(updateTaskSchema.safeParse({ position: -1 }).success).toBe(false);
  });

  it("rejects a non-integer position", () => {
    expect(updateTaskSchema.safeParse({ position: 1.5 }).success).toBe(false);
  });
});

describe("reorderSchema", () => {
  it("accepts a column and a non-empty id list", () => {
    expect(reorderSchema.parse({ column: "todo", orderedIds: ["a", "b"] }).orderedIds).toHaveLength(2);
  });

  it("rejects an empty id list", () => {
    expect(reorderSchema.safeParse({ column: "todo", orderedIds: [] }).success).toBe(false);
  });
});
