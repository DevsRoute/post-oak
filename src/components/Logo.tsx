import iconUrl from "../assets/post-oak-icon.jpeg";

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <img
      src={iconUrl}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      style={{
        display: "block",
        borderRadius: Math.round(size * 0.22),
        objectFit: "cover",
        flexShrink: 0,
      }}
    />
  );
}
