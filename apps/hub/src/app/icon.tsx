import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#121210",
          color: "#d97a2b",
          fontSize: 20,
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        M
      </div>
    ),
    size
  );
}
