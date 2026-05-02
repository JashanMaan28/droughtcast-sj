import { Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { HORIZONS, type ModelBundle } from "../model";
import type { Row } from "../types";
import { Glass } from "../ui/Glass";
import { TopBar } from "../ui/TopBar";
import { TOKENS } from "../ui/tokens";

export function AboutTab({
  rows,
  models,
}: {
  rows: Row[];
  models: ModelBundle;
}) {
  const first = rows[0];
  const last = rows[rows.length - 1];
  const span = `${first.date.toLocaleDateString(undefined, { month: "short", year: "numeric" })} – ${last.date.toLocaleDateString(undefined, { month: "short", year: "numeric" })}`;

  return (
    <View>
      <TopBar title="About" sub="Methodology & sources" />

      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
          <Text
            style={{
              fontSize: 11,
              color: TOKENS.textMid,
              letterSpacing: 0.6,
              fontWeight: "500",
            }}
          >
            METHOD
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: TOKENS.textHi,
              marginTop: 8,
              lineHeight: 21,
            }}
          >
            Four multivariate linear regressions trained on-device, one per forecast
            horizon (1, 3, 6, 12 months). Features: current snowpack & precipitation
            (% of normal), 3-month-lagged snowpack & precipitation, plus sin/cos
            seasonality of month-of-year. The 12-month curve interpolates between
            those four anchors.
          </Text>
        </View>
      </Glass>

      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
          <Text
            style={{
              fontSize: 11,
              color: TOKENS.textMid,
              letterSpacing: 0.6,
              fontWeight: "500",
            }}
          >
            MODEL FIT (R² IN-SAMPLE)
          </Text>
          <View style={{ marginTop: 12, gap: 10 }}>
            {HORIZONS.map((h) => (
              <R2Bar key={h} label={`+${h} mo`} r2={models[h].r2} />
            ))}
          </View>
        </View>
      </Glass>

      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
          <Text
            style={{
              fontSize: 11,
              color: TOKENS.textMid,
              letterSpacing: 0.6,
              fontWeight: "500",
            }}
          >
            SOURCE
          </Text>
          <View style={{ marginTop: 8 }}>
            <Row label="Dataset" value="H2O Hackathon Challenge" />
            <Row label="Endpoint" value="scoringapi.h2ohackathon.org" />
            <Row label="Coverage" value={span} />
            <Row label="Records" value={`${rows.length} months`} />
            <Row label="Region" value="San Joaquin County, CA" />
          </View>
        </View>
      </Glass>

      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
          <Text
            style={{
              fontSize: 11,
              color: TOKENS.textMid,
              letterSpacing: 0.6,
              fontWeight: "500",
            }}
          >
            STAGE THRESHOLDS
          </Text>
          <View style={{ marginTop: 8 }}>
            <ThresholdRow color="#A8E6FF" label="Normal" range="> 85% reservoir" />
            <ThresholdRow color="#C7E5C0" label="Watch" range="75 – 85%" />
            <ThresholdRow color="#FFCB7A" label="Warning" range="65 – 75%" />
            <ThresholdRow color="#FF8A6B" label="Emergency" range="< 65%" />
          </View>
        </View>
      </Glass>

      <View
        style={{
          marginHorizontal: 14,
          marginBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Svg width={11} height={11} viewBox="0 0 24 24">
            <Path
              d="M12 9v4M12 17h0"
              stroke={TOKENS.textLo}
              strokeWidth={1.6}
              strokeLinecap="round"
            />
            <Path
              d="M12 3l10 18H2L12 3z"
              stroke={TOKENS.textLo}
              strokeWidth={1.4}
              fill="none"
            />
          </Svg>
          <Text
            style={{
              fontSize: 11,
              color: TOKENS.textLo,
              letterSpacing: 0.3,
            }}
          >
            Hackathon prototype. Don't make irrigation decisions from this.
          </Text>
        </View>
      </View>
    </View>
  );
}

function R2Bar({ label, r2 }: { label: string; r2: number }) {
  const pct = Math.max(0, Math.min(1, r2)) * 100;
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Text style={{ fontSize: 12, color: TOKENS.textMid, fontWeight: "500" }}>
          {label}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: TOKENS.textHi,
            fontWeight: "500",
            letterSpacing: -0.1,
          }}
        >
          {r2.toFixed(2)}
        </Text>
      </View>
      <View
        style={{
          marginTop: 4,
          height: 3,
          borderRadius: 2,
          backgroundColor: "rgba(255,255,255,0.14)",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${pct}%`,
            backgroundColor: "#A8E6FF",
          }}
        />
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderColor: TOKENS.divider,
      }}
    >
      <Text style={{ fontSize: 12, color: TOKENS.textMid }}>{label}</Text>
      <Text
        style={{
          fontSize: 12,
          color: TOKENS.textHi,
          fontWeight: "500",
          letterSpacing: -0.1,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function ThresholdRow({
  color,
  label,
  range,
}: {
  color: string;
  label: string;
  range: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        gap: 10,
      }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
        }}
      />
      <Text
        style={{
          fontSize: 12,
          color: TOKENS.textHi,
          fontWeight: "500",
          width: 90,
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 12, color: TOKENS.textMid }}>{range}</Text>
    </View>
  );
}
