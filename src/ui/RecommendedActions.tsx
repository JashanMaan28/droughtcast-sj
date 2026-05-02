import { Text, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { useApp } from "../context/AppContext";
import { Glass } from "./Glass";
import { TOKENS } from "./tokens";

type ActionKey = "drip" | "delayWatering" | "checkLeaks" | "reduceOutdoor";
const ACTIONS: ActionKey[] = ["drip", "delayWatering", "checkLeaks", "reduceOutdoor"];

/**
 * Action recommendations shown beneath high-risk forecasts. The caller
 * decides when to render — typically only when stage is Watch or worse.
 */
export function RecommendedActions() {
  const { t } = useApp();

  return (
    <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
      <View
        style={{
          paddingHorizontal: 18,
          paddingTop: 14,
          paddingBottom: 8,
          borderBottomWidth: 0.5,
          borderColor: TOKENS.divider,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            color: TOKENS.textMid,
            letterSpacing: 0.6,
            fontWeight: "500",
          }}
        >
          {t.recommendedActions.title.toUpperCase()}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: TOKENS.textLo,
            marginTop: 3,
          }}
        >
          {t.recommendedActions.sub}
        </Text>
      </View>
      <View style={{ paddingVertical: 6 }}>
        {ACTIONS.map((k, i) => (
          <ActionRow
            key={k}
            label={t.recommendedActions.items[k]}
            kind={k}
            divider={i < ACTIONS.length - 1}
          />
        ))}
      </View>
    </Glass>
  );
}

function ActionRow({
  label,
  kind,
  divider,
}: {
  label: string;
  kind: ActionKey;
  divider: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderBottomWidth: divider ? 0.5 : 0,
        borderColor: TOKENS.divider,
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 8,
          backgroundColor: "rgba(168,230,255,0.14)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActionGlyph kind={kind} />
      </View>
      <Text
        style={{
          flex: 1,
          fontSize: 14,
          color: TOKENS.textHi,
          fontWeight: "500",
          letterSpacing: -0.1,
        }}
      >
        {label}
      </Text>
      <Svg width={14} height={14} viewBox="0 0 24 24">
        <Path
          d="M9 6l6 6-6 6"
          stroke={TOKENS.textLo}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

function ActionGlyph({ kind }: { kind: ActionKey }) {
  const c = "#A8E6FF";
  if (kind === "drip") {
    return (
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Path
          d="M12 3l4 7a4 4 0 11-8 0l4-7z"
          stroke={c}
          strokeWidth={1.6}
          strokeLinejoin="round"
          fill="none"
        />
        <Circle cx={12} cy={20} r={1.2} fill={c} />
      </Svg>
    );
  }
  if (kind === "delayWatering") {
    return (
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Circle cx={12} cy={12} r={9} stroke={c} strokeWidth={1.6} fill="none" />
        <Path
          d="M12 7v5l3 2"
          stroke={c}
          strokeWidth={1.6}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    );
  }
  if (kind === "checkLeaks") {
    return (
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Path
          d="M5 11h6v8H5zM11 8h8v11h-8z"
          stroke={c}
          strokeWidth={1.6}
          strokeLinejoin="round"
          fill="none"
        />
        <Circle cx={15} cy={13.5} r={1.2} fill={c} />
      </Svg>
    );
  }
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24">
      <Path
        d="M4 18h16M6 18V9a6 6 0 0112 0v9"
        stroke={c}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Path d="M9 14h6" stroke={c} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}
