import { createFocusTrap, getFocusBounds, getFocusableElements } from "../focus-trap";

function mount(html: string): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = html;
  document.body.appendChild(container);
  return container;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("getFocusableElements", () => {
  it("finds the usual interactive elements in DOM order", () => {
    const container = mount(`
      <a href="#one">one</a>
      <button>two</button>
      <input />
      <textarea></textarea>
      <select></select>
    `);
    expect(getFocusableElements(container)).toHaveLength(5);
  });

  it("skips disabled controls", () => {
    const container = mount(`<button disabled>no</button><button>yes</button>`);
    const focusable = getFocusableElements(container);
    expect(focusable).toHaveLength(1);
    expect(focusable[0]?.textContent).toBe("yes");
  });

  it("skips tabindex -1", () => {
    const container = mount(`<div tabindex="-1">no</div><div tabindex="0">yes</div>`);
    expect(getFocusableElements(container)).toHaveLength(1);
  });

  it("skips anything inside a hidden or aria-hidden subtree", () => {
    const container = mount(`
      <div hidden><button>hidden</button></div>
      <div aria-hidden="true"><button>aria hidden</button></div>
      <button>visible</button>
    `);
    const focusable = getFocusableElements(container);
    expect(focusable).toHaveLength(1);
    expect(focusable[0]?.textContent).toBe("visible");
  });

  it("returns an empty list for a container with nothing focusable", () => {
    expect(getFocusableElements(mount(`<p>text only</p>`))).toEqual([]);
  });
});

describe("getFocusBounds", () => {
  it("reports the first and last focusable elements", () => {
    const container = mount(`<button>a</button><button>b</button><button>c</button>`);
    const { first, last } = getFocusBounds(container);
    expect(first?.textContent).toBe("a");
    expect(last?.textContent).toBe("c");
  });

  it("reports nulls when nothing is focusable, rather than undefined", () => {
    expect(getFocusBounds(mount(`<p>nothing</p>`))).toEqual({ first: null, last: null });
  });

  it("reports the same element as both bounds when there is only one", () => {
    const { first, last } = getFocusBounds(mount(`<button>only</button>`));
    expect(first).toBe(last);
  });
});

describe("createFocusTrap", () => {
  it("wraps Tab from the last element back to the first", () => {
    const container = mount(`<button>a</button><button>b</button>`);
    const [first, last] = getFocusableElements(container);
    const release = createFocusTrap(container);

    last?.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));

    expect(document.activeElement).toBe(first);
    release();
  });

  it("wraps Shift+Tab from the first element back to the last", () => {
    const container = mount(`<button>a</button><button>b</button>`);
    const [first, last] = getFocusableElements(container);
    const release = createFocusTrap(container);

    first?.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", shiftKey: true, bubbles: true }));

    expect(document.activeElement).toBe(last);
    release();
  });

  it("leaves Tab alone in the middle of the list", () => {
    const container = mount(`<button>a</button><button>b</button><button>c</button>`);
    const middle = getFocusableElements(container)[1];
    const release = createFocusTrap(container);

    middle?.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));

    expect(document.activeElement).toBe(middle);
    release();
  });

  it("ignores keys other than Tab", () => {
    const container = mount(`<button>a</button><button>b</button>`);
    const last = getFocusableElements(container)[1];
    const release = createFocusTrap(container);

    last?.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }));

    expect(document.activeElement).toBe(last);
    release();
  });

  it("stops trapping once released", () => {
    const container = mount(`<button>a</button><button>b</button>`);
    const [first, last] = getFocusableElements(container);
    const release = createFocusTrap(container);
    release();

    last?.focus();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));

    expect(document.activeElement).toBe(last);
    expect(document.activeElement).not.toBe(first);
  });

  it("does not throw when the container holds nothing focusable", () => {
    const container = mount(`<p>nothing</p>`);
    const release = createFocusTrap(container);
    expect(() => {
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true }));
    }).not.toThrow();
    release();
  });
});
