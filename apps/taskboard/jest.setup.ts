import "@testing-library/jest-dom";

// jsdom does not implement matchMedia; components that read OS theme
// preference (e.g. @portfolio/ui's ThemeToggle) rely on this.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  }) as unknown as MediaQueryList;
}
