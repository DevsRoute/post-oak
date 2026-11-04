import logoUrl from "../assets/post-oak-logo.png";

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <span
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: Math.round(size * 0.24),
        flexShrink: 0,
      }}
    >
      <img
        src={logoUrl}
        alt=""
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          transform: "scale(1.9)",
          transformOrigin: "center",
          display: "block",
        }}
      />
    </span>
  );
}
