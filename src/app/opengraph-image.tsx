import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Saswat Barai — Backend Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#191919",
          padding: "64px",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            fontSize: 22,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#8c8c8c",
          }}
        >
          <div style={{ width: 12, height: 12, backgroundColor: "#ffe500", display: "flex" }} />
          portfolio.v3
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: "#f7f7f7",
              lineHeight: 1.05,
              display: "flex",
            }}
          >
            Saswat Barai
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 32,
              color: "#ffe500",
              display: "flex",
            }}
          >
            Backend Engineer
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 22,
              color: "#8c8c8c",
              display: "flex",
              maxWidth: 880,
            }}
          >
            Building scalable APIs, microservices, and real-time systems.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 20,
            color: "#8c8c8c",
            letterSpacing: "0.05em",
          }}
        >
          saswat.app
        </div>
      </div>
    ),
    { ...size }
  );
}
