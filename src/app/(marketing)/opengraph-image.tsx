import { ImageResponse } from "next/og";
import { SITE } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = SITE.title;

// Generated rather than shipped as an asset so the card never drifts from
// the copy it is advertising.
export default function OpengraphImage() {
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
          background: "#fcfcfb",
          color: "#0b0b0b",
        }}
      >
        <div style={{ fontSize: 30, color: "#898781" }}>{SITE.name}</div>
        <div style={{ fontSize: 68, fontWeight: 600, marginTop: 24, lineHeight: 1.2 }}>
          원화 기준으로 보는
        </div>
        <div style={{ fontSize: 68, fontWeight: 600, lineHeight: 1.2 }}>
          장기 시세 대시보드
        </div>
        <div style={{ fontSize: 28, color: "#52514e", marginTop: 32 }}>
          주식 · 금 · 은 · 환율을 한 화면에서
        </div>
      </div>
    ),
    size,
  );
}
