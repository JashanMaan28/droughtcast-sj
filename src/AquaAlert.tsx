import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  Text,
  View,
} from "react-native";
import { forecastCurve, type ModelBundle } from "./model";
import { fireAlert } from "./notifications";
import { classify, STAGE_BG, STAGE_RANK } from "./stage";
import type { DroughtStage, Row } from "./types";

const STAGE_ICON: Record<
  DroughtStage,
  React.ComponentProps<typeof Feather>["name"]
> = {
  Normal: "check-circle",
  Watch: "eye",
  Warning: "alert-triangle",
  Emergency: "alert-octagon",
};

export function AquaAlert({
  rows,
  models,
}: {
  rows: Row[];
  models: ModelBundle;
}) {
  const latest = rows[rows.length - 1];

  // Worst predicted stage in the next 12 months, using current real
  // conditions as the simulation input.
  const { worstStage, worstMonth, worstPct } = useMemo(() => {
    const curve = forecastCurve(
      models,
      rows,
      latest.snowpack,
      latest.precip,
      latest.month,
    );
    let worst: DroughtStage = "Normal";
    let pct = curve[0];
    let monthsAhead = 1;
    curve.forEach((v, i) => {
      const s = classify(v);
      if (STAGE_RANK[s] > STAGE_RANK[worst]) {
        worst = s;
        pct = v;
        monthsAhead = i + 1;
      }
    });
    return {
      worstStage: worst as DroughtStage,
      worstMonth: monthsAhead,
      worstPct: pct,
    };
  }, [rows, models, latest]);

  const [status, setStatus] = useState<
    "idle" | "sent" | "denied" | "sending"
  >("idle");

  // Auto-schedule a notification once if forecast is Warning or Emergency.
  const autoFiredRef = useRef(false);
  useEffect(() => {
    if (autoFiredRef.current) return;
    if (STAGE_RANK[worstStage] >= 2) {
      autoFiredRef.current = true;
      fireAlert(
        `AquaAlert: ${worstStage}`,
        `Reservoir forecast hits ${Math.round(
          worstPct,
        )}% in ${worstMonth} mo. ${worstStage} stage projected.`,
      ).catch(() => {});
    }
  }, [worstStage, worstMonth, worstPct]);

  const onDemo = async () => {
    setStatus("sending");
    const ok = await fireAlert(
      `AquaAlert demo: ${worstStage}`,
      `Predicted reservoir ${Math.round(
        worstPct,
      )}% in ${worstMonth} months — ${worstStage} stage. (Demo)`,
    );
    setStatus(ok ? "sent" : "denied");
  };

  // Pulse animation for Emergency
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (worstStage !== "Emergency") {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.04,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [worstStage, pulse]);

  return (
    <Animated.View
      style={{ transform: [{ scale: pulse }] }}
      className={`mt-4 rounded-2xl p-5 shadow ${STAGE_BG[worstStage]}`}
    >
      <View className="flex-row items-center">
        <Feather name={STAGE_ICON[worstStage]} size={22} color="white" />
        <Text className="ml-2 text-base font-bold text-white">
          AquaAlert · 12-month outlook
        </Text>
      </View>
      <Text className="mt-2 text-2xl font-extrabold text-white">
        {worstStage}
      </Text>
      <Text className="mt-1 text-sm text-white/90">
        Worst projected reservoir: {Math.round(worstPct)}% in {worstMonth}{" "}
        months.
      </Text>

      <Pressable
        onPress={onDemo}
        accessibilityRole="button"
        accessibilityLabel="Send a demo AquaAlert push notification"
        className="mt-4 self-start rounded-xl bg-white/20 px-4 py-3"
        style={{ minHeight: 44 }}
      >
        <View className="flex-row items-center">
          <Feather name="bell" size={16} color="white" />
          <Text className="ml-2 font-semibold text-white">
            {status === "sending"
              ? "Sending…"
              : status === "sent"
                ? "Alert sent ✓"
                : status === "denied"
                  ? "Notifications blocked"
                  : "🔔 Send demo alert"}
          </Text>
        </View>
      </Pressable>
      {status === "denied" ? (
        <Text className="mt-2 text-xs text-white/80">
          Enable notifications in system settings to receive AquaAlerts.
          In-app banner still active.
        </Text>
      ) : null}
    </Animated.View>
  );
}
