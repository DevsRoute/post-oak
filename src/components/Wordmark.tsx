import type { CSSProperties } from "react";
import wordmarkUrl from "../assets/post-oak-wordmark.jpeg";

interface Props {
  height?: number;
  width?: number;
}

/* Full "pillar + POST OAK GROUP" wordmark banner.
   Pass either height or width; the other dimension auto-scales. */
export default function Wordmark({ height, width }: Props) {
  const style: CSSProperties = {
    display: "block",
    flexShrink: 0,
    objectFit: "cover",
  };
  if (width) {
    style.width = width;
    style.height = "auto";
    style.borderRadius = Math.round(width * 0.06);
  } else {
    const h = height ?? 32;
    style.height = h;
    style.width = "auto";
    style.borderRadius = Math.round(h * 0.14);
  }
  return <img src={wordmarkUrl} alt="Post Oak Group" style={style} />;
}
