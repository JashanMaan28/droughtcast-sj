import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { forecastCurve, type ModelBundle } from "./model";
import type { Row } from "./types";

const MONTH_INITIALS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export function ForecastChart({
  rows,
  models,
  snowpack,
  precip,
  month,
}: {
  rows: Row[];
  models: ModelBundle;
  snowpack: number;
  precip: number;
  month: number;
}) {
  const HIST_N = 24;
  const FUT_N = 12;
  const history = rows.slice(-HIST_N).map((r) => r.reservoir);
  const futureFromUser = forecastCurve(models, rows, snowpack, precip, month);

  const data = [...history, ...futureFromUser];
  const labels: string[] = [];
  const lastDate = rows[rows.length - 1].date;
  for (let i = -HIST_N + 1; i <= FUT_N; i++) {
    const idx = i + HIST_N - 1; // 0..(HIST_N+FUT_N-1)
    const d = new Date(lastDate);
    d.setMonth(d.getMonth() + i);
    // Show only every 6 months to keep axis readable.
    labels.push(idx % 6 === 0 ? MONTH_INITIALS[d.getMonth()] : "");
  }

  const width = Dimensions.get("window").width - 32 - 32; // screen - card padding

  return (
    <View className="mt-5">
      <View className="flex-row justify-between">
        <Text className="text-sm font-semibold text-stone-700">
          Reservoir trajectory
        </Text>
        <Text className="text-xs text-stone-500">
          24mo actual · 12mo forecast
        </Text>
      </View>
      <LineChart
        data={{
          labels,
          datasets: [
            { data, color: () => "#0c4a6e", strokeWidth: 2 },
            // 65 / 85 reference lines (bottom of warning, top of watch)
            { data: Array(data.length).fill(65), color: () => "#fca5a5", strokeWidth: 1, withDots: false },
            { data: Array(data.length).fill(85), color: () => "#86efac", strokeWidth: 1, withDots: false },
          ],
          legend: ["Reservoir %"],
        }}
        width={width}
        height={200}
        fromZero
        yAxisSuffix="%"
        withInnerLines={false}
        withVerticalLines={false}
        withDots={false}
        bezier
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          decimalPlaces: 0,
          color: (op = 1) => `rgba(12, 74, 110, ${op})`,
          labelColor: () => "#78716c",
          propsForBackgroundLines: { stroke: "#e7e5e4" },
        }}
        style={{ marginTop: 8, borderRadius: 12 }}
      />
      <View className="mt-1 flex-row justify-between px-2">
        <Text className="text-[10px] text-stone-400">
          ← past · forecast →
        </Text>
        <Text className="text-[10px] text-stone-400">
          dashed: 65% / 85% thresholds
        </Text>
      </View>
    </View>
  );
}
