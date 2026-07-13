import type { Preview, Decorator } from "@storybook/react";
import { useEffect } from "react";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/jetbrains-mono/400.css";
import "../src/styles.css";

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? "light";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.setProperty(
      "--font-heading",
      "'Space Grotesk', ui-sans-serif, system-ui, sans-serif"
    );
    document.documentElement.style.setProperty(
      "--font-body",
      "'Inter', ui-sans-serif, system-ui, sans-serif"
    );
    document.documentElement.style.setProperty(
      "--font-mono",
      "'JetBrains Mono', ui-monospace, monospace"
    );
  }, [theme]);

  return (
    <div
      style={{
        background: "var(--color-neutral-0)",
        color: "var(--color-neutral-800)",
        minHeight: "100vh",
        padding: "2rem",
        fontFamily: "var(--font-body)",
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
  globalTypes: {
    theme: {
      name: "Theme",
      description: "Light/dark theme",
      defaultValue: "light",
      toolbar: {
        icon: "mirror",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
      },
    },
  },
  decorators: [withTheme],
};

export default preview;
