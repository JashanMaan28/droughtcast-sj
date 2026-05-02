import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useApp } from "../context/AppContext";
import { STAGE_THEME } from "../stage";
import type { DroughtStage } from "../types";
import { Glass } from "./Glass";
import { TOKENS } from "./tokens";

/**
 * Role-targeted "for you" card. Returns null when no role is set, so the
 * caller can render unconditionally without an extra guard.
 */
export function PersonalizedAlert({ stage }: { stage: DroughtStage }) {
  const { role, t } = useApp();
  if (!role) return null;

  const accent = STAGE_THEME[stage].accent;
  const body = t.personalizedAlert.body[role];
  const roleLabel = t.roles.label[role];

  return (
    <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
      <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              backgroundColor: accent + "33",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Svg width={12} height={12} viewBox="0 0 24 24">
              <Path
                d="M12 2.5a4 4 0 014 4v.5h.5a3.5 3.5 0 010 7H7.5a3.5 3.5 0 010-7H8v-.5a4 4 0 014-4z"
                stroke={accent}
                strokeWidth={1.6}
                fill="none"
                strokeLinejoin="round"
              />
              <Path
                d="M9 17l3 4 3-4"
                stroke={accent}
                strokeWidth={1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </View>
          <Text
            style={{
              fontSize: 11,
              color: accent,
              fontWeight: "700",
              letterSpacing: 1.2,
            }}
          >
            {t.personalizedAlert.eyebrow} · {roleLabel.toUpperCase()}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 13,
            color: TOKENS.textMid,
            marginTop: 10,
            letterSpacing: -0.1,
          }}
        >
          {t.personalizedAlert.headline}
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: TOKENS.textHi,
            fontWeight: "500",
            letterSpacing: -0.3,
            marginTop: 4,
            lineHeight: 24,
          }}
        >
          {body}
        </Text>
      </View>
    </Glass>
  );
}
