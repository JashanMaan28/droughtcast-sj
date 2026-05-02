import Slider from "@react-native-community/slider";
import { useMemo } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Stop } from "react-native-svg";
import { forecastCurve, HORIZONS, type ModelBundle } from "../model";
import { classify, STAGE_THEME } from "../stage";
import type { Row } from "../types";
import { Glass } from "../ui/Glass";
import { TopBar } from "../ui/TopBar";
import { TOKENS } from "../ui/tokens";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function SimulatorTab({
  rows,
  models,
  sp,
  pr,
  month,
  onSp,
  onPr,
  onMonth,
}: {
  rows: Row[];
  models: ModelBundle;
  sp: number;
  pr: number;
  month: number;
  onSp: (v: number) => void;
  onPr: (v: number) => void;
  onMonth: (v: number) => void;
}) {
  const latest = rows[rows.length - 1];

  const curve = useMemo(
    () => forecastCurve(models, rows, sp, pr, month),
    [models, rows, sp, pr, month],
  );

  const predictedAt6 = curve[5];
  const stage = classify(predictedAt6);
  const delta = predictedAt6 - latest.reservoir;

  const futureMonth = (k: number) => {
    const m = ((month - 1 + k) % 12) + 1;
    return MONTHS[m - 1];
  };

  return (
    <View>
      <TopBar title="Simulator" sub="What if conditions changed?" />

      {/* Hero predicted-at-6 */}
      <View style={{ paddingHorizontal: 14, paddingBottom: 12 }}>
        <View style={{ alignItems: "center", paddingVertical: 14 }}>
          <Text
            style={{
              fontSize: 11,
              color: TOKENS.textMid,
              fontWeight: "500",
              letterSpacing: 0.6,
            }}
          >
            PREDICTED IN 6 MONTHS
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              marginTop: 6,
            }}
          >
            <Text
              style={{
                fontSize: 96,
                fontWeight: "200",
                color: TOKENS.textHi,
                letterSpacing: -4,
                lineHeight: 100,
              }}
              accessibilityLabel={`Predicted reservoir ${Math.round(predictedAt6)} percent in six months`}
            >
              {Math.round(predictedAt6)}
            </Text>
            <Text style={{ fontSize: 32, color: TOKENS.textMid, marginLeft: 4 }}>
              %
            </Text>
          </View>
          <Text
            style={{
              fontSize: 13,
              color: delta >= 0 ? "#A8E6FF" : STAGE_THEME[stage].accent,
              marginTop: 4,
              letterSpacing: -0.1,
            }}
          >
            {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)} pp from today · {stage}
          </Text>
        </View>
      </View>

      {/* Forecast chart */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8 }}>
          <Text
            style={{
              fontSize: 11,
              color: TOKENS.textMid,
              letterSpacing: 0.6,
              fontWeight: "500",
            }}
          >
            24 MO HISTORY · 12 MO FORECAST
          </Text>
        </View>
        <ForecastSparkline rows={rows} curve={curve} />
      </Glass>

      {/* Sliders */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 16, paddingVertical: 14 }}>
          <SliderRow
            label="Snowpack"
            value={sp}
            unit="% of normal"
            min={0}
            max={200}
            step={1}
            onChange={onSp}
          />
          <View style={{ height: 12 }} />
          <SliderRow
            label="Precipitation"
            value={pr}
            unit="% of normal"
            min={0}
            max={200}
            step={1}
            onChange={onPr}
          />
          <View style={{ height: 12 }} />
          <SliderRow
            label="Start month"
            value={month}
            unit={MONTHS[month - 1]}
            min={1}
            max={12}
            step={1}
            onChange={onMonth}
            displayRaw
          />
          <Pressable
            onPress={() => {
              onSp(latest.snowpack);
              onPr(latest.precip);
              onMonth(latest.month);
            }}
            accessibilityRole="button"
            accessibilityLabel="Reset sliders to current real conditions"
            style={{
              marginTop: 14,
              alignSelf: "flex-start",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.16)",
              minHeight: 36,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                color: TOKENS.textHi,
                fontWeight: "500",
                letterSpacing: 0.2,
              }}
            >
              Reset to current
            </Text>
          </Pressable>
        </View>
      </Glass>

      {/* Horizon strip */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View
          style={{
            paddingHorizontal: 14,
            paddingTop: 12,
            paddingBottom: 6,
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
            HORIZONS
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 12,
            paddingHorizontal: 8,
          }}
        >
          {HORIZONS.map((h) => {
            const v = curve[h - 1];
            const cs = classify(v);
            return (
              <View
                key={h}
                style={{ flex: 1, alignItems: "center" }}
              >
                <Text
                  style={{ fontSize: 11, color: TOKENS.textMid, fontWeight: "500" }}
                >
                  +{h}mo
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: TOKENS.textLo,
                    marginTop: 1,
                  }}
                >
                  {futureMonth(h)}
                </Text>
                <Text
                  style={{
                    fontSize: 22,
                    color: TOKENS.textHi,
                    fontWeight: "300",
                    letterSpacing: -0.6,
                    marginTop: 6,
                  }}
                >
                  {Math.round(v)}%
                </Text>
                <View
                  style={{
                    marginTop: 6,
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: STAGE_THEME[cs].accent,
                  }}
                />
                <Text
                  style={{
                    fontSize: 9,
                    color: TOKENS.textLo,
                    marginTop: 4,
                    letterSpacing: 0.3,
                  }}
                >
                  R² {models[h].r2.toFixed(2)}
                </Text>
              </View>
            );
          })}
        </View>
      </Glass>
    </View>
  );
}

function SliderRow({
  label,
  value,
  unit,
  min,
  max,
  step,
  onChange,
  displayRaw,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  displayRaw?: boolean;
}) {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color: TOKENS.textMid,
            letterSpacing: 0.4,
            fontWeight: "500",
          }}
        >
          {label.toUpperCase()}
        </Text>
        <Text style={{ fontSize: 13, color: TOKENS.textHi, fontWeight: "500" }}>
          {displayRaw ? unit : `${value} ${unit}`}
        </Text>
      </View>
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor="#A8E6FF"
        maximumTrackTintColor="rgba(255,255,255,0.25)"
        thumbTintColor="#FFFFFF"
        accessibilityLabel={`${label} slider, current ${value}`}
        style={{ marginTop: 4 }}
      />
    </View>
  );
}

function ForecastSparkline({
  rows,
  curve,
}: {
  rows: Row[];
  curve: number[];
}) {
  // 24 months of history + 12 months of forecast
  const history = rows.slice(-24).map((r) => r.reservoir);
  const all = [...history, ...curve];
  const w = 320;
  const h = 120;
  const pad = 8;
  const min = Math.min(...all, 50);
  const max = Math.max(...all, 100);
  const range = max - min || 1;
  const dx = (w - pad * 2) / (all.length - 1);

  const px = (i: number) => pad + i * dx;
  const py = (v: number) => pad + (1 - (v - min) / range) * (h - pad * 2);

  // Solid path for history
  let histD = "";
  history.forEach((v, i) => {
    histD += i === 0 ? `M${px(i)},${py(v)}` : ` L${px(i)},${py(v)}`;
  });

  // Forecast path (continues from last history point)
  let foreD = "";
  const startIdx = history.length - 1;
  curve.forEach((v, i) => {
    const idx = startIdx + 1 + i;
    if (i === 0) {
      foreD += `M${px(startIdx)},${py(history[history.length - 1])} L${px(idx)},${py(v)}`;
    } else {
      foreD += ` L${px(idx)},${py(v)}`;
    }
  });

  // Fill area under combined curve
  let fillD = `M${px(0)},${h - pad}`;
  all.forEach((v, i) => {
    fillD += ` L${px(i)},${py(v)}`;
  });
  fillD += ` L${px(all.length - 1)},${h - pad} Z`;

  // Today divider line
  const todayX = px(history.length - 1);

  // Stage threshold lines
  const lines = [
    { v: 85, c: "rgba(255,255,255,0.18)" },
    { v: 75, c: "rgba(255,203,122,0.25)" },
    { v: 65, c: "rgba(255,138,107,0.3)" },
  ].filter((l) => l.v >= min && l.v <= max);

  return (
    <View style={{ paddingHorizontal: 6, paddingBottom: 12 }}>
      <Svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <Defs>
          <SvgLinearGradient id="fillG" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#A8E6FF" stopOpacity={0.35} />
            <Stop offset="100%" stopColor="#A8E6FF" stopOpacity={0} />
          </SvgLinearGradient>
        </Defs>
        {lines.map((l, i) => (
          <Path
            key={i}
            d={`M${pad},${py(l.v)} L${w - pad},${py(l.v)}`}
            stroke={l.c}
            strokeWidth={0.5}
            strokeDasharray="3,3"
            fill="none"
          />
        ))}
        <Path d={fillD} fill="url(#fillG)" />
        <Path
          d={histD}
          stroke="#FFFFFF"
          strokeWidth={1.6}
          fill="none"
          strokeLinejoin="round"
        />
        <Path
          d={foreD}
          stroke="#A8E6FF"
          strokeWidth={1.6}
          strokeDasharray="4,3"
          fill="none"
          strokeLinejoin="round"
        />
        <Path
          d={`M${todayX},${pad} L${todayX},${h - pad}`}
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={0.6}
        />
      </Svg>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 8,
          marginTop: 4,
        }}
      >
        <Text style={{ fontSize: 10, color: TOKENS.textLo }}>−24mo</Text>
        <Text style={{ fontSize: 10, color: TOKENS.textLo }}>today</Text>
        <Text style={{ fontSize: 10, color: TOKENS.textLo }}>+12mo</Text>
      </View>
    </View>
  );
}

