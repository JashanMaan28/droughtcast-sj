import "./global.css";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { fetchRows } from "./src/api";
import { HORIZONS, trainModels, type ModelBundle } from "./src/model";
import { Simulator } from "./src/Simulator";
import { classify, STAGE_BG } from "./src/stage";
import type { Row } from "./src/types";

export default function App() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRows()
      .then(setRows)
      .catch((e) => setError(String(e)));
  }, []);

  const models: ModelBundle | null = useMemo(
    () => (rows ? trainModels(rows) : null),
    [rows],
  );

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
          <Text className="mt-3 text-stone-600">
            Training drought model…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const latest = rows[rows.length - 1];
  const stage = classify(latest.reservoir);

  return (
    <SafeAreaView className="flex-1 bg-stone-50">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
        <Text className="text-3xl font-bold text-sky-900">DroughtCast SJ</Text>
        <Text className="mt-1 text-stone-600">
          ML-powered drought forecasting for San Joaquin County
        </Text>

        <View className="mt-6 rounded-2xl bg-white p-5 shadow">
          <Text className="text-stone-500">Current Status</Text>
          <Text className="mt-1 text-xs text-stone-400">
            {latest.date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })}
          </Text>
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
        </View>

        <Simulator rows={rows} models={models} />

        <View className="mt-4 rounded-2xl bg-white p-5 shadow">
          <Text className="text-stone-500">Model Stats</Text>
          <Text className="mt-1 text-xs text-stone-400">
            Multivariate linear regression · trained on {rows.length} months
          </Text>
          <View className="mt-3 flex-row justify-between">
            {HORIZONS.map((h) => (
              <View key={h} className="items-center">
                <Text className="text-xs uppercase text-stone-500">
                  {h}mo
                </Text>
                <Text className="text-lg font-bold text-sky-900">
                  R² {models[h].r2.toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
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
