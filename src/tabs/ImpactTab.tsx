import { useEffect, useRef } from "react";
import { Animated, Easing, Text, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { IMPACT, STAGE_THEME } from "../stage";
import type { DroughtStage } from "../types";
import { Glass } from "../ui/Glass";
import { TopBar } from "../ui/TopBar";
import { TOKENS } from "../ui/tokens";

export function ImpactTab({
  stage,
  pct,
}: {
  stage: DroughtStage;
  pct: number;
}) {
  const profile = IMPACT[stage];
  const theme = STAGE_THEME[stage];

  return (
    <View>
      <TopBar title="Local Impact" sub={`Reservoir at ${Math.round(pct)}%`} />

      {/* Severity banner */}
      <View style={{ paddingHorizontal: 14, paddingBottom: 12 }}>
        <SeverityBanner stage={stage} headline={profile.severityHeadline} />
      </View>

      {/* Household */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
          <SectionHeader icon="home" label="HOUSEHOLD" />
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              gap: 6,
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontSize: 48,
                fontWeight: "200",
                color: TOKENS.textHi,
                letterSpacing: -2,
                lineHeight: 52,
              }}
              accessibilityLabel={`Household water budget ${profile.household.gpd} gallons per day`}
            >
              {profile.household.gpd}
            </Text>
            <Text style={{ fontSize: 14, color: TOKENS.textMid }}>
              gal/day
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: theme.accent, marginTop: 2 }}>
            {profile.household.label}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 14, gap: 8 }}>
            <MicroStat label="Shower" value={profile.household.shower} />
            <MicroStat label="Lawn" value={profile.household.lawn} />
            <MicroStat label="Pool" value={profile.household.pool} />
          </View>
        </View>
      </Glass>

      {/* Farm */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
          <SectionHeader icon="leaf" label="FARM ALLOCATION" />
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              gap: 6,
              marginTop: 8,
            }}
          >
            <Text
              style={{
                fontSize: 48,
                fontWeight: "200",
                color: TOKENS.textHi,
                letterSpacing: -2,
                lineHeight: 52,
              }}
            >
              {profile.farm.allocation}
            </Text>
            <Text style={{ fontSize: 14, color: TOKENS.textMid }}>
              % of normal
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: theme.accent, marginTop: 2 }}>
            {profile.farm.label}
          </Text>
          <AllocBar pct={profile.farm.allocation} accent={theme.accent} />
          <View style={{ flexDirection: "row", marginTop: 12, gap: 8 }}>
            <MicroStat
              label="Acres fallowed"
              value={profile.farm.acresFallowed.toLocaleString()}
            />
          </View>
        </View>
      </Glass>

      {/* Reservoir tank visualization */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
          <SectionHeader icon="droplet" label="RESERVOIRS" />
          <View
            style={{
              flexDirection: "row",
              marginTop: 12,
              justifyContent: "space-around",
            }}
          >
            <Tank label="Don Pedro" basePct={pct} mult={profile.reservoir.mult} />
            <Tank label="New Melones" basePct={pct} mult={profile.reservoir.mult * 0.95} />
            <Tank label="New Hogan" basePct={pct} mult={profile.reservoir.mult * 1.05} />
          </View>
          <View style={{ flexDirection: "row", marginTop: 14, gap: 8 }}>
            <MicroStat label="Level" value={profile.reservoir.level} />
            <MicroStat label="Boating" value={profile.reservoir.boating} />
            <MicroStat label="Fishing" value={profile.reservoir.fishing} />
          </View>
        </View>
      </Glass>

      {/* Economic */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
          <SectionHeader icon="dollar" label="ECONOMIC IMPACT" />
          <View
            style={{
              flexDirection: "row",
              marginTop: 10,
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "200",
                  color: TOKENS.textHi,
                  letterSpacing: -1.5,
                  lineHeight: 40,
                }}
              >
                ${profile.economic.lossM}M
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: TOKENS.textMid,
                  marginTop: 2,
                  letterSpacing: 0.3,
                }}
              >
                CROP LOSS
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: "200",
                  color: TOKENS.textHi,
                  letterSpacing: -1.5,
                  lineHeight: 40,
                }}
              >
                {profile.economic.jobs.toLocaleString()}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: TOKENS.textMid,
                  marginTop: 2,
                  letterSpacing: 0.3,
                }}
              >
                JOBS AT RISK
              </Text>
            </View>
          </View>
        </View>
      </Glass>
    </View>
  );
}

function SeverityBanner({
  stage,
  headline,
}: {
  stage: DroughtStage;
  headline: string;
}) {
  const theme = STAGE_THEME[stage];
  const bar = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    bar.setValue(0);
    Animated.timing(bar, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [bar, stage]);
  const width = bar.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", `${rankPct(stage)}%`] as [string, string],
  });

  return (
    <View
      style={{
        borderRadius: 18,
        overflow: "hidden",
        backgroundColor: "rgba(255,255,255,0.10)",
        borderWidth: 0.5,
        borderColor: "rgba(255,255,255,0.18)",
      }}
    >
      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12 }}>
        <Text
          style={{
            fontSize: 11,
            color: TOKENS.textMid,
            letterSpacing: 0.6,
            fontWeight: "500",
          }}
        >
          SEVERITY · {stage.toUpperCase()}
        </Text>
        <Text
          style={{
            fontSize: 22,
            fontWeight: "500",
            color: TOKENS.textHi,
            marginTop: 4,
            letterSpacing: -0.6,
          }}
        >
          {headline}
        </Text>
        <View
          style={{
            marginTop: 10,
            height: 4,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.15)",
            overflow: "hidden",
          }}
        >
          <Animated.View
            style={{
              height: "100%",
              width,
              backgroundColor: theme.accent,
            }}
          />
        </View>
      </View>
    </View>
  );
}

function rankPct(stage: DroughtStage) {
  return { Normal: 25, Watch: 50, Warning: 75, Emergency: 100 }[stage];
}

function SectionHeader({
  icon,
  label,
}: {
  icon: "home" | "leaf" | "droplet" | "dollar";
  label: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <Svg width={11} height={11} viewBox="0 0 24 24">
        {icon === "home" ? (
          <Path
            d="M3 12L12 4l9 8M5 10v10h14V10"
            stroke="#fff"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        ) : icon === "leaf" ? (
          <Path
            d="M5 19c0-9 6-15 15-15-1 9-6 15-15 15zM5 19l5-5"
            stroke="#fff"
            strokeWidth={1.6}
            strokeLinecap="round"
            fill="none"
          />
        ) : icon === "droplet" ? (
          <Path
            d="M12 3l5 8a5 5 0 11-10 0l5-8z"
            stroke="#fff"
            strokeWidth={1.6}
            strokeLinejoin="round"
            fill="none"
          />
        ) : (
          <Path
            d="M12 3v18M16 7H10a3 3 0 000 6h4a3 3 0 010 6H8"
            stroke="#fff"
            strokeWidth={1.6}
            strokeLinecap="round"
            fill="none"
          />
        )}
      </Svg>
      <Text
        style={{
          fontSize: 11,
          color: TOKENS.textMid,
          letterSpacing: 0.6,
          fontWeight: "500",
        }}
      >
        {label}
      </Text>
    </View>
  );
}

function MicroStat({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.08)",
      }}
    >
      <Text
        style={{
          fontSize: 9,
          color: TOKENS.textLo,
          letterSpacing: 0.3,
          fontWeight: "500",
        }}
      >
        {label.toUpperCase()}
      </Text>
      <Text
        style={{
          fontSize: 13,
          color: TOKENS.textHi,
          marginTop: 2,
          fontWeight: "500",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function AllocBar({ pct, accent }: { pct: number; accent: string }) {
  const w = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    w.setValue(0);
    Animated.timing(w, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [w, pct]);
  const widthAnim = w.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", `${pct}%`] as [string, string],
  });
  return (
    <View
      style={{
        marginTop: 10,
        height: 6,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.14)",
        overflow: "hidden",
      }}
    >
      <Animated.View
        style={{ height: "100%", width: widthAnim, backgroundColor: accent }}
      />
    </View>
  );
}

function Tank({
  label,
  basePct,
  mult,
}: {
  label: string;
  basePct: number;
  mult: number;
}) {
  const fillPct = Math.max(5, Math.min(100, basePct * mult));
  const fillAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    fillAnim.setValue(0);
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [fillAnim, fillPct]);
  const heightAnim = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", `${fillPct}%`] as [string, string],
  });
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <View
        style={{
          width: 48,
          height: 70,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.32)",
          overflow: "hidden",
          justifyContent: "flex-end",
          backgroundColor: "rgba(255,255,255,0.06)",
        }}
      >
        <Svg
          width={48}
          height={70}
          viewBox="0 0 48 70"
          style={{ position: "absolute", inset: 0 }}
        >
          <Rect x={0} y={70 - 70 * 0.85} width={48} height={0.4} fill="rgba(168,230,255,0.4)" />
        </Svg>
        <Animated.View
          style={{
            width: "100%",
            height: heightAnim,
            backgroundColor: "rgba(168,230,255,0.55)",
          }}
        />
      </View>
      <Text style={{ fontSize: 11, color: TOKENS.textHi, marginTop: 6, fontWeight: "500" }}>
        {Math.round(fillPct)}%
      </Text>
      <Text
        style={{
          fontSize: 9,
          color: TOKENS.textLo,
          marginTop: 1,
          letterSpacing: 0.3,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
