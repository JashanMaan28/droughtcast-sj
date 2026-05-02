import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { classify, STAGE_TEXT } from "./stage";
import type { DroughtStage } from "./types";

type Card = {
  icon: React.ComponentProps<typeof Feather>["name"];
  title: string;
  subtitle: string;
  bullet: (s: DroughtStage, pct: number) => string;
};

const CARDS: Card[] = [
  {
    icon: "home",
    title: "Stockton residents",
    subtitle: "City of Stockton MUD",
    bullet: (s) => STAGE_TEXT[s],
  },
  {
    icon: "sun",
    title: "Lodi / Manteca farmers",
    subtitle: "Almond + grape allocations",
    bullet: (s, pct) => {
      const alloc = Math.max(0, Math.min(100, Math.round(pct - 25)));
      const note =
        s === "Emergency"
          ? "Severe cuts — fallowing likely"
          : s === "Warning"
            ? "Reduced surface deliveries"
            : s === "Watch"
              ? "Near-normal allocations"
              : "Full allocations expected";
      return `~${alloc}% ag allocation · ${note}`;
    },
  },
  {
    icon: "droplet",
    title: "New Melones / Don Pedro",
    subtitle: "SJ County's primary reservoirs",
    bullet: (_s, pct) =>
      `Modeled storage ${Math.round(pct)}% of capacity. Tracks Stanislaus + Tuolumne snowmelt.`,
  },
];

export function LocalImpact({ projectedPct }: { projectedPct: number }) {
  const stage = classify(projectedPct);
  return (
    <View className="mt-4 rounded-2xl bg-white p-5 shadow">
      <Text className="text-lg font-bold text-sky-900">Local impact</Text>
      <Text className="mt-1 text-xs text-stone-500">
        Based on the simulator's 6-month forecast ({Math.round(projectedPct)}%
        · {stage}).
      </Text>
      <View className="mt-4">
        {CARDS.map((c) => (
          <View
            key={c.title}
            className="mb-3 flex-row rounded-xl border border-stone-200 p-3"
          >
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-sky-100">
              <Feather name={c.icon} size={20} color="#0c4a6e" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-sky-900">{c.title}</Text>
              <Text className="text-xs text-stone-500">{c.subtitle}</Text>
              <Text className="mt-1 text-sm text-stone-700">
                {c.bullet(stage, projectedPct)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
