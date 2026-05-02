import Svg, { Circle, Ellipse, G, Path } from "react-native-svg";
import type { DroughtStage } from "../types";

export function StageGlyph({
  stage,
  size = 22,
}: {
  stage: DroughtStage;
  size?: number;
}) {
  if (stage === "Normal") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx={9} cy={11} r={4} fill="#fff" />
        <Ellipse cx={14} cy={13} rx={6} ry={4} fill="#fff" opacity={0.85} />
      </Svg>
    );
  }
  if (stage === "Watch") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx={12} cy={12} r={5} fill="#fff" />
        <G stroke="#fff" strokeWidth={1.5} strokeLinecap="round">
          <Path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
        </G>
      </Svg>
    );
  }
  if (stage === "Warning") {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Circle cx={12} cy={12} r={5} fill="#fff" />
        <Path
          d="M2 17h7M14 17h8M4 20h6M16 20h5"
          stroke="#fff"
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.6}
        />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M12 3l9 17H3L12 3z" fill="#fff" />
      <Path
        d="M12 10v5M12 17.5v0.5"
        stroke="#4A1010"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}
