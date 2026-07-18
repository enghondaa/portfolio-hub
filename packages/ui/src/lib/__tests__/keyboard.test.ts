import { getNextIndex, getPrevIndex, isKey, Keys } from "../keyboard";

describe("Keys", () => {
  it("maps Space to a literal space, which is the value that is easy to get wrong", () => {
    expect(Keys.Space).toBe(" ");
  });
});

describe("isKey", () => {
  it("matches on the event key", () => {
    expect(isKey({ key: "Escape" } as KeyboardEvent, Keys.Escape)).toBe(true);
    expect(isKey({ key: "Enter" } as KeyboardEvent, Keys.Escape)).toBe(false);
  });
});

describe("index wrapping", () => {
  it("advances and wraps at the end", () => {
    expect(getNextIndex(0, 3)).toBe(1);
    expect(getNextIndex(2, 3)).toBe(0);
  });

  it("retreats and wraps at the start", () => {
    expect(getPrevIndex(2, 3)).toBe(1);
    expect(getPrevIndex(0, 3)).toBe(2);
  });

  it("never divides by zero on an empty list", () => {
    expect(getNextIndex(0, 0)).toBe(0);
    expect(getPrevIndex(0, 0)).toBe(0);
  });

  it("handles a single item by staying put", () => {
    expect(getNextIndex(0, 1)).toBe(0);
    expect(getPrevIndex(0, 1)).toBe(0);
  });
});
