import "./global.css";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { fetchRows } from "./src/api";
import { AquaAlert } from "./src/AquaAlert";
import { LocalImpact } from "./src/LocalImpact";
import { HORIZONS, trainModels, type ModelBundle } from "./src/model";
import { Simulator } from "./src/Simulator";
import { classify, STAGE_BG } from "./src/stage";
import type { Row } from "./src/types";

export default function App() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sixMo, setSixMo] = useState<number | null>(null);

  useEffect(() => {
    fetchRows()
      .then(setRows)
      .catch((e) => setError(String(e)));
  }, []);

  const models: ModelBundle | null = useMemo(
    () => (rows ? trainModels(rows) : null),
    [rows],
  );

  const handleSixMo = useCallback((pct: number) => setSixMo(pct), []);

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-stone-50">
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-red-600">Failed to load data: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!rows || !models) {
    return (
      <SafeAreaView className="flex-1 bg-stone-50">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0c4a6e" />
          <Text className="mt-3 text-stone-600">Training drought model…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const latest = rows[rows.length - 1];
  const stage = classify(latest.reservoir);
  const projected = sixMo ?? latest.reservoir;

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 64 }}>
        <View className="flex-row items-center">
          <Feather name="droplet" size={26} color="#0c4a6e" />
          <Text className="ml-2 text-3xl font-bold text-sky-900">
            DroughtCast SJ
          </Text>
        </View>
        <Text className="mt-1 text-stone-600">
          ML-powered drought forecasting for San Joaquin County
        </Text>

        <CurrentStatusCard rows={rows} />

        <AquaAlert rows={rows} models={models} />

        <Simulator rows={rows} models={models} onSixMonthChange={handleSixMo} />

        <LocalImpact projectedPct={projected} />

        <View className="mt-4 rounded-2xl bg-white p-5 shadow">
          <View className="flex-row items-center">
            <Feather name="bar-chart-2" size={16} color="#0c4a6e" />
            <Text className="ml-2 text-stone-500">Model Stats</Text>
          </View>
          <Text className="mt-1 text-xs text-stone-400">
            Multivariate linear regression · trained on {rows.length} months
          </Text>
          <View className="mt-3 flex-row justify-between">
            {HORIZONS.map((h) => (
              <View key={h} className="items-center">
                <Text className="text-xs uppercase text-stone-500">{h}mo</Text>
                <Text className="text-lg font-bold text-sky-900">
                  R² {models[h].r2.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-4 rounded-2xl border border-stone-200 bg-stone-100 p-4">
          <Text className="text-xs font-semibold uppercase text-stone-500">
            Methodology
          </Text>
          <Text className="mt-2 text-xs leading-5 text-stone-600">
            Forecasts come from four multivariate linear regressions (1, 3, 6,
            12 month horizons) trained on-device against {rows.length} months
            of California snowpack, precipitation, and reservoir storage data
            from the H2O Hackathon dataset
            (scoringapi.h2ohackathon.org/Challenge/json). Features: current
            snowpack & precip (% of normal), 3-month-lagged snowpack & precip,
            and a sin/cos encoding of month-of-year for seasonality. R² is
            in-sample on monthly observations. Stages follow CA DWR
            convention: &gt;85% Normal, 75–85% Watch, 65–75% Warning, &lt;65%
            Emergency. Don't make irrigation decisions from a hackathon demo.
          </Text>
          <Text className="mt-2 text-xs italic text-stone-500">
            Stage = {stage}.
          </Text>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

function CurrentStatusCard({ rows }: { rows: Row[] }) {
  const latest = rows[rows.length - 1];
  const stage = classify(latest.reservoir);
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (stage !== "Emergency") {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.03,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [stage, pulse]);

  return (
    <Animated.View
      style={{ transform: [{ scale: pulse }] }}
      className="mt-6 rounded-2xl bg-white p-5 shadow"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-stone-500">Current Status</Text>
        <Text className="text-xs text-stone-400">
          {latest.date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
          })}
        </Text>
      </View>
      <View className="mt-3 flex-row justify-between">
        <Stat label="Snowpack" value={`${latest.snowpack}%`} />
        <Stat label="Precip" value={`${latest.precip}%`} />
        <Stat label="Reservoir" value={`${latest.reservoir}%`} />
      </View>
      <View
        className={`mt-4 self-start rounded-full px-3 py-1 ${STAGE_BG[stage]}`}
      >
        <Text className="text-sm font-semibold text-white">
          Stage: {stage}
        </Text>
      </View>
    </Animated.View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View>
      <Text className="text-xs uppercase text-stone-500">{label}</Text>
      <Text className="text-2xl font-bold text-sky-900">{value}</Text>
    </View>
  );
}
