import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mohand Elshahawy — Full-Stack MERN Developer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#121210",
          color: "#f7f7f6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, color: "#d97a2b", letterSpacing: 2, textTransform: "uppercase" }}>
          Full-Stack Developer
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 72, fontWeight: 600, letterSpacing: -1 }}>
          Mohand Elshahawy
        </div>
        <div style={{ display: "flex", marginTop: 24, fontSize: 30, color: "#a8a69e" }}>
          Live demo apps, not mockups.
        </div>
      </div>
    ),
    size
  );
}
