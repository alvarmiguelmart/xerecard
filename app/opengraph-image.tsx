import { ImageResponse } from "next/og";

export const alt = "xR Xerecard";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7fafc",
          color: "#111827",
          fontFamily: "Arial, sans-serif",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 22% 20%, rgba(56,189,248,0.24), transparent 30%), radial-gradient(circle at 78% 72%, rgba(255,106,61,0.16), transparent 34%)"
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 44,
            border: "1px solid rgba(17,24,39,0.12)",
            borderRadius: 42
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 44,
            position: "relative"
          }}
        >
          <div
            style={{
              width: 250,
              height: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 46,
              border: "3px solid rgba(17,24,39,0.88)",
              background: "#ffffff",
              boxShadow: "0 28px 80px rgba(17,24,39,0.16)"
            }}
          >
            <span
              style={{
                fontSize: 104,
                fontWeight: 900,
                letterSpacing: -2
              }}
            >
              xR
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 92, fontWeight: 900, lineHeight: 1 }}>
              Xerecard
            </span>
            <span
              style={{
                marginTop: 18,
                fontSize: 34,
                fontWeight: 700,
                color: "rgba(17,24,39,0.64)"
              }}
            >
              Marketplace de serviços
            </span>
          </div>
        </div>
      </div>
    ),
    size
  );
}
