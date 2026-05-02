import Slider from "@react-native-community/slider";
import { useEffect, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import { ForecastChart } from "./ForecastChart";
import { HORIZONS, predictHorizon, type ModelBundle } from "./model";
import { classify, STAGE_BG, STAGE_COLOR } from "./stage";
import type { Horizon, Row } from "./types";

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type Inputs = { snowpack: number; precip: number; month: number };

export function Simulator({
  rows,
  models,
  onSixMonthChange,
}: {
  rows: Row[];
  models: ModelBundle;
  onSixMonthChange?: (pct: number) => void;
}) {
  const latest = rows[rows.length - 1];

  const [live, setLive] = useState<Inputs>({
    snowpack: latest.snowpack,
    precip: latest.precip,
    month: latest.month,
  });
  const [debounced, setDebounced] = useState<Inputs>(live);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDebounced(live), 100);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [live]);

  const predictions = useMemo(() => {
    const out: Record<Horizon, number> = {} as Record<Horizon, number>;
    for (const h of HORIZONS) {
      out[h] = clamp(
        predictHorizon(
          models,
          rows,
          debounced.snowpack,
          debounced.precip,
          debounced.month,
          h,
        ),
        0,
        100,
      );
    }
    return out;
  }, [debounced, models, rows]);

  const heroPct = predictions[6];
  const heroStage = classify(heroPct);

  useEffect(() => {
    onSixMonthChange?.(heroPct);
  }, [heroPct, onSixMonthChange]);

  return (
    <View className="mt-4 rounded-2xl bg-white p-5 shadow">
      <Text className="text-lg font-bold text-sky-900">
        Reservoir Simulator
      </Text>
      <Text className="mt-1 text-xs text-stone-500">
        Drag the sliders to model next winter.
      </Text>

      <View className="mt-5">
        <Text
          className="mb-1 text-3xl font-extrabold text-sky-900"
          accessibilityRole="header"
          accessibilityLabel={`Predicted reservoir in 6 months ${Math.round(
            heroPct,
          )} percent, stage ${heroStage}`}
        >
          {Math.round(heroPct)}%
        </Text>
        <Text className="text-stone-600">
          Predicted reservoir in 6 months ·{" "}
          <Text style={{ color: STAGE_COLOR[heroStage], fontWeight: "700" }}>
            {heroStage}
          </Text>
        </Text>
        <View className="mt-3 flex-row justify-between">
          {HORIZONS.map((h) => {
            const s = classify(predictions[h]);
            return (
              <View key={h} className="items-center">
                <Text className="text-[10px] uppercase text-stone-500">
                  {h}mo
                </Text>
                <Text className="text-lg font-bold text-sky-900">
                  {Math.round(predictions[h])}%
                </Text>
                <View className={`mt-1 rounded-full px-2 py-0.5 ${STAGE_BG[s]}`}>
                  <Text className="text-[10px] font-semibold text-white">
                    {s}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <ForecastChart
        rows={rows}
        models={models}
        snowpack={debounced.snowpack}
        precip={debounced.precip}
        month={debounced.month}
      />

      <SliderRow
        label="Snowpack"
        suffix="% of normal"
        min={0}
        max={200}
        step={1}
        value={live.snowpack}
        onChange={(v) => setLive((s) => ({ ...s, snowpack: v }))}
      />
      <SliderRow
        label="Precipitation"
        suffix="% of normal"
        min={0}
        max={200}
        step={1}
        value={live.precip}
        onChange={(v) => setLive((s) => ({ ...s, precip: v }))}
      />
      <SliderRow
        label="Starting month"
        suffix={MONTH_NAMES[live.month - 1]}
        showSuffixOnly
        min={1}
        max={12}
        step={1}
        value={live.month}
        onChange={(v) => setLive((s) => ({ ...s, month: Math.round(v) }))}
      />
    </View>
  );
}

function SliderRow({
  label,
  suffix,
  min,
  max,
  step,
  value,
  onChange,
  showSuffixOnly,
}: {
  label: string;
  suffix: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  showSuffixOnly?: boolean;
}) {
  return (
    <View className="mt-4">
      <View className="flex-row justify-between">
        <Text className="text-sm font-semibold text-stone-700">{label}</Text>
        <Text className="text-sm text-stone-600">
          {showSuffixOnly ? suffix : `${Math.round(value)} ${suffix}`}
        </Text>
      </View>
      <Slider
        style={{ width: "100%", height: 44 }}
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor="#0c4a6e"
        maximumTrackTintColor="#d6d3d1"
        thumbTintColor="#0ea5e9"
        accessibilityLabel={`${label} slider, current value ${Math.round(
          value,
        )}`}
        accessibilityRole="adjustable"
      />
    </View>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
