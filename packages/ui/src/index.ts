"use client";

// This whole package is marked as a client boundary. Most of these
// components (Button, Input, Select, Modal, Tabs, Navbar, ThemeToggle) hold
// state or wire up event handlers and need it; Card/Badge/Table/Footer don't
// strictly need it, but splitting the bundle per-component just to keep a
// few of them server-renderable isn't worth the build complexity for a
// component set this size.
export * from "./components/Button";
export * from "./components/Card";
export * from "./components/Input";
export * from "./components/Select";
export * from "./components/Modal";
export * from "./components/Tabs";
export * from "./components/Table";
export * from "./components/Badge";
export * from "./components/Navbar";
export * from "./components/Footer";
export * from "./components/ThemeToggle";

// Behaviour primitives, ported from the forge-ui-primitives project. These
// are the parts a styled component library still needs but rarely factors
// out: focus containment, controlled/uncontrolled state, ref merging, and
// keyboard navigation constants.
export * from "./lib/keyboard";
export * from "./lib/merge-refs";
export * from "./lib/focus-trap";
export * from "./lib/use-controllable-state";
export * from "./lib/use-outside-click";
