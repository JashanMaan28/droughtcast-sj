import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Pressable,
  Text,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { forecastCurve, type ModelBundle } from "../model";
import { classify, STAGE_RANK, STAGE_THEME } from "../stage";
import type { DroughtStage, Row } from "../types";
import { Glass } from "../ui/Glass";
import { StageGlyph } from "../ui/StageGlyph";
import { TopBar } from "../ui/TopBar";
import { TOKENS } from "../ui/tokens";

const MONTH_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function TodayTab({
  rows,
  models,
  onDemo,
  demoFired,
}: {
  rows: Row[];
  models: ModelBundle;
  onDemo: () => void;
  demoFired: boolean;
}) {
  const latest = rows[rows.length - 1];
  const stage = classify(latest.reservoir);

  // Forecast from current real conditions (not slider state).
  const curve = useMemo(
    () =>
      forecastCurve(
        models,
        rows,
        latest.snowpack,
        latest.precip,
        latest.month,
      ),
    [models, rows, latest],
  );
  const { worstStage, worstPct, worstMonthIdx } = useMemo(() => {
    let s: DroughtStage = "Normal";
    let pct = curve[0];
    let mi = 1;
    curve.forEach((v, i) => {
      const cs = classify(v);
      if (STAGE_RANK[cs] > STAGE_RANK[s]) {
        s = cs;
        pct = v;
        mi = i + 1;
      }
    });
    return {
      worstStage: s as DroughtStage,
      worstPct: pct,
      worstMonthIdx: mi,
    };
  }, [curve]);

  const worstTheme = STAGE_THEME[worstStage];
  const isAlert = worstStage !== "Normal";

  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!isAlert) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isAlert, pulse]);

  const ringWidth = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 8],
  });

  const headerSub = latest.date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
  });

  // The forecast strip uses absolute month labels for upcoming months.
  const futureMonth = (k: number) => {
    const m = ((latest.month - 1 + k) % 12) + 1;
    return MONTH_SHORT[m - 1];
  };
  const worstLabel = `${futureMonth(worstMonthIdx)}`;

  return (
    <View>
      <TopBar title="San Joaquin" sub={headerSub} />

      {/* HERO AQUAALERT */}
      <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
        <Animated.View
          style={{
            borderRadius: 24,
            overflow: "hidden",
            borderWidth: 1.5,
            borderColor: isAlert ? worstTheme.accent : "rgba(255,255,255,0.25)",
            shadowColor: worstTheme.accent,
            shadowOpacity: isAlert ? 0.35 : 0,
            shadowRadius: ringWidth as unknown as number,
            shadowOffset: { width: 0, height: 8 },
            elevation: isAlert ? 10 : 0,
          }}
        >
          {isAlert ? (
            <LinearGradient
              colors={[worstTheme.gradFlat, worstTheme.accent + "BB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 18 }}
            >
              <AlertContent
                stage={worstStage}
                pct={worstPct}
                monthLabel={worstLabel}
                onDemo={onDemo}
                demoFired={demoFired}
                ctaTextColor={worstTheme.gradFlat}
              />
            </LinearGradient>
          ) : (
            <View style={{ padding: 18, backgroundColor: "rgba(255,255,255,0.16)" }}>
              <AlertContent
                stage={worstStage}
                pct={worstPct}
                monthLabel={worstLabel}
                onDemo={onDemo}
                demoFired={demoFired}
                ctaTextColor="#0c4a6e"
              />
            </View>
          )}
        </Animated.View>
      </View>

      {/* Current reservoir */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingVertical: 14 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: TOKENS.textMid,
                fontWeight: "500",
                letterSpacing: 0.6,
              }}
            >
              CURRENT RESERVOIR
            </Text>
            <Text style={{ fontSize: 12, color: TOKENS.textMid }}>{stage}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              gap: 6,
              marginTop: 4,
            }}
          >
            <Text
              style={{
                fontSize: 56,
                fontWeight: "200",
                color: TOKENS.textHi,
                letterSpacing: -2.5,
                lineHeight: 60,
              }}
              accessibilityLabel={`Current reservoir ${latest.reservoir} percent`}
            >
              {latest.reservoir}
            </Text>
            <Text style={{ fontSize: 22, color: TOKENS.textMid }}>%</Text>
          </View>
        </View>
      </Glass>

      {/* 12-month forecast strip */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View
          style={{
            paddingHorizontal: 14,
            paddingTop: 10,
            paddingBottom: 6,
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
            12-MONTH FORECAST
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 14,
            paddingHorizontal: 8,
            justifyContent: "space-between",
          }}
        >
          {[1, 2, 3, 4, 6, 9, 12].map((h) => {
            const v = curve[h - 1] ?? latest.reservoir;
            const cs = classify(v);
            return (
              <View key={h} style={{ alignItems: "center", flex: 1 }}>
                <Text
                  style={{ fontSize: 12, color: TOKENS.textMid, fontWeight: "500" }}
                >
                  {futureMonth(h)}
                </Text>
                <View style={{ marginVertical: 8 }}>
                  <StageGlyph stage={cs} size={22} />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    color: TOKENS.textHi,
                    fontWeight: "500",
                    letterSpacing: -0.3,
                  }}
                >
                  {Math.round(v)}%
                </Text>
              </View>
            );
          })}
        </View>
      </Glass>

      {/* Snowpack / Precip cards */}
      <View
        style={{
          marginHorizontal: 14,
          flexDirection: "row",
          gap: 8,
        }}
      >
        <View style={{ flex: 1 }}>
          <DetailCard label="SNOWPACK" value={latest.snowpack} icon="snow" />
        </View>
        <View style={{ flex: 1 }}>
          <DetailCard label="PRECIP" value={latest.precip} icon="rain" />
        </View>
      </View>
    </View>
  );
}

function AlertContent({
  stage,
  pct,
  monthLabel,
  onDemo,
  demoFired,
  ctaTextColor,
}: {
  stage: DroughtStage;
  pct: number;
  monthLabel: string;
  onDemo: () => void;
  demoFired: boolean;
  ctaTextColor: string;
}) {
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: "rgba(255,255,255,0.25)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Svg width={16} height={16} viewBox="0 0 24 24">
            <Path
              d="M12 2a7 7 0 00-7 7v4l-2 3h18l-2-3V9a7 7 0 00-7-7z"
              fill="#fff"
            />
            <Path
              d="M9 19a3 3 0 006 0"
              stroke="#fff"
              strokeWidth={2}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </View>
        <Text
          style={{
            fontSize: 11,
            color: "#fff",
            fontWeight: "700",
            letterSpacing: 1.2,
          }}
        >
          AQUAALERT · ACTIVE
        </Text>
      </View>
      <Text
        style={{
          fontSize: 36,
          fontWeight: "600",
          color: "#fff",
          letterSpacing: -1.2,
          marginTop: 12,
          lineHeight: 40,
        }}
      >
        {stage} stage
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.92)",
          marginTop: 4,
        }}
      >
        forecasted by {monthLabel} · reservoir at {Math.round(pct)}%
      </Text>
      <Pressable
        onPress={onDemo}
        accessibilityRole="button"
        accessibilityLabel="Send a demo AquaAlert push notification"
        style={{
          marginTop: 16,
          backgroundColor: "#fff",
          borderRadius: 14,
          paddingVertical: 13,
          alignItems: "center",
          minHeight: 44,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: ctaTextColor,
            letterSpacing: -0.1,
          }}
        >
          {demoFired ? "✓ Alert sent to your phone" : "Notify me when stage changes"}
        </Text>
      </Pressable>
    </View>
  );
}

function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: "snow" | "rain";
}) {
  return (
    <Glass>
      <View style={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Svg width={11} height={11} viewBox="0 0 24 24">
            {icon === "snow" ? (
              <Path
                d="M12 2v20M4 6l16 12M4 18l16-12M2 12h20"
                stroke="#fff"
                strokeWidth={1.6}
                strokeLinecap="round"
                fill="none"
              />
            ) : (
              <>
                <Path
                  d="M7 13a5 5 0 0110 0"
                  stroke="#fff"
                  strokeWidth={1.6}
                  fill="none"
                  strokeLinecap="round"
                />
                <Path
                  d="M9 17v3M12 17v3M15 17v3"
                  stroke="#fff"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                />
              </>
            )}
          </Svg>
          <Text
            style={{
              fontSize: 10,
              color: TOKENS.textMid,
              fontWeight: "500",
              letterSpacing: 0.6,
            }}
          >
            {label}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            gap: 3,
            marginTop: 6,
          }}
        >
          <Text
            style={{
              fontSize: 38,
              fontWeight: "300",
              color: TOKENS.textHi,
              letterSpacing: -1.5,
              lineHeight: 40,
            }}
          >
            {value}
          </Text>
          <Text style={{ fontSize: 16, color: TOKENS.textMid }}>%</Text>
        </View>
        <Text style={{ fontSize: 11, color: TOKENS.textLo, marginTop: 4 }}>
          of normal
        </Text>
      </View>
    </Glass>
  );
}
