import "./global.css";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { fetchRows } from "./src/api";
import { Atmosphere } from "./src/atmosphere/Atmosphere";
import { forecastCurve, trainModels, type ModelBundle } from "./src/model";
import { classify } from "./src/stage";
import { AboutTab } from "./src/tabs/AboutTab";
import { ImpactTab } from "./src/tabs/ImpactTab";
import { SimulatorTab } from "./src/tabs/SimulatorTab";
import { TodayTab } from "./src/tabs/TodayTab";
import { TabBar, type TabId } from "./src/ui/TabBar";
import { TOKENS } from "./src/ui/tokens";
import type { Row } from "./src/types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export default function App() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("today");

  // Lifted simulator state — also drives Atmosphere on Simulator/Impact tabs.
  const [sp, setSp] = useState<number | null>(null);
  const [pr, setPr] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  const [demoFired, setDemoFired] = useState(false);

  useEffect(() => {
    fetchRows()
      .then((r) => {
        setRows(r);
        const last = r[r.length - 1];
        setSp(last.snowpack);
        setPr(last.precip);
        setMonth(last.month);
      })
      .catch((e) => setError(String(e)));
  }, []);

  const models: ModelBundle | null = useMemo(
    () => (rows ? trainModels(rows) : null),
    [rows],
  );

  // Atmosphere stage: on Today tab, classify from real current curve at +6mo;
  // on Simulator/Impact, classify from slider-driven curve at +6mo.
  const atmosphereStage = useMemo(() => {
    if (!rows || !models) return "Normal" as const;
    const last = rows[rows.length - 1];
    if (tab === "today" || tab === "about") {
      const curve = forecastCurve(
        models,
        rows,
        last.snowpack,
        last.precip,
        last.month,
      );
      return classify(curve[5]);
    }
    if (sp == null || pr == null || month == null) return classify(last.reservoir);
    const curve = forecastCurve(models, rows, sp, pr, month);
    return classify(curve[5]);
  }, [rows, models, tab, sp, pr, month]);

  const impactInfo = useMemo(() => {
    if (!rows || !models) return null;
    const last = rows[rows.length - 1];
    const useSp = sp ?? last.snowpack;
    const usePr = pr ?? last.precip;
    const useMo = month ?? last.month;
    const curve = forecastCurve(models, rows, useSp, usePr, useMo);
    return { stage: classify(curve[5]), pct: curve[5] };
  }, [rows, models, sp, pr, month]);

  const onDemo = useCallback(async () => {
    setDemoFired(true);

    if (!Device.isDevice) return;
    try {
      const perms = await Notifications.getPermissionsAsync();
      let granted = perms.status === "granted";
      if (!granted) {
        const req = await Notifications.requestPermissionsAsync();
        granted = req.status === "granted";
      }
      if (!granted) return;
      if (!rows || !models) return;
      const last = rows[rows.length - 1];
      const curve = forecastCurve(
        models,
        rows,
        last.snowpack,
        last.precip,
        last.month,
      );
      const stage = classify(curve[5]);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "DroughtCast",
          body: `${stage} forecast — reservoir at ${Math.round(curve[5])}% by month +6.`,
        },
        trigger: null,
      });
    } catch {
      // Notifications are a nice-to-have.
    }
  }, [rows, models]);

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0B2A4A" }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Text style={{ color: "#FF8A6B" }}>Failed to load data: {error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!rows || !models) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0B2A4A" }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#A8E6FF" />
          <Text style={{ marginTop: 12, color: TOKENS.textMid }}>
            Training drought model…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const last = rows[rows.length - 1];
  const useSp = sp ?? last.snowpack;
  const usePr = pr ?? last.precip;
  const useMo = month ?? last.month;

  return (
    <View style={{ flex: 1 }}>
      <Atmosphere stageName={atmosphereStage} width={SCREEN_W} height={SCREEN_H}>
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              paddingTop: Platform.OS === "android" ? 24 : 0,
              paddingBottom: 110,
            }}
            showsVerticalScrollIndicator={false}
          >
            {tab === "today" ? (
              <TodayTab
                rows={rows}
                models={models}
                onDemo={onDemo}
                demoFired={demoFired}
              />
            ) : tab === "sim" ? (
              <SimulatorTab
                rows={rows}
                models={models}
                sp={useSp}
                pr={usePr}
                month={useMo}
                onSp={setSp}
                onPr={setPr}
                onMonth={setMonth}
              />
            ) : tab === "impact" && impactInfo ? (
              <ImpactTab stage={impactInfo.stage} pct={impactInfo.pct} />
            ) : (
              <AboutTab rows={rows} models={models} />
            )}
          </ScrollView>
        </SafeAreaView>
      </Atmosphere>

      <TabBar active={tab} onChange={setTab} />
      <StatusBar style="light" />
    </View>
  );
}
