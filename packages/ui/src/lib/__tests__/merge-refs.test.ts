import { createRef } from "react";
import { mergeRefs } from "../merge-refs";

describe("mergeRefs", () => {
  it("assigns to ref objects", () => {
    const a = createRef<HTMLDivElement>();
    const b = createRef<HTMLDivElement>();
    const node = document.createElement("div");

    mergeRefs<HTMLDivElement>(a, b)(node);

    expect(a.current).toBe(node);
    expect(b.current).toBe(node);
  });

  it("calls callback refs", () => {
    const calls: (HTMLDivElement | null)[] = [];
    const node = document.createElement("div");

    mergeRefs<HTMLDivElement>((value) => {
      calls.push(value);
    })(node);

    expect(calls).toEqual([node]);
  });

  it("mixes both kinds in one call", () => {
    const objectRef = createRef<HTMLDivElement>();
    let callbackValue: HTMLDivElement | null = null;
    const node = document.createElement("div");

    mergeRefs<HTMLDivElement>(objectRef, (value) => {
      callbackValue = value;
    })(node);

    expect(objectRef.current).toBe(node);
    expect(callbackValue).toBe(node);
  });

  it("ignores undefined refs rather than throwing", () => {
    const ref = createRef<HTMLDivElement>();
    const node = document.createElement("div");
    expect(() => mergeRefs<HTMLDivElement>(undefined, ref, undefined)(node)).not.toThrow();
    expect(ref.current).toBe(node);
  });

  it("propagates null on unmount", () => {
    const ref = createRef<HTMLDivElement>();
    const merged = mergeRefs<HTMLDivElement>(ref);
    merged(document.createElement("div"));
    merged(null);
    expect(ref.current).toBeNull();
  });
});
