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
import { AppProvider, useApp } from "./src/context/AppContext";
import { forecastCurve, trainModels, type ModelBundle } from "./src/model";
import { classify, STAGE_RANK } from "./src/stage";
import { ImpactTab } from "./src/tabs/ImpactTab";
import { SettingsTab } from "./src/tabs/SettingsTab";
import { SimulatorTab } from "./src/tabs/SimulatorTab";
import { TodayTab } from "./src/tabs/TodayTab";
import { OnboardingModal } from "./src/ui/OnboardingModal";
import { PersonalizedAlert } from "./src/ui/PersonalizedAlert";
import { PushToast } from "./src/ui/PushToast";
import { RecommendedActions } from "./src/ui/RecommendedActions";
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
  return (
    <AppProvider>
      <AppShell />
      <OnboardingModal />
    </AppProvider>
  );
}

function AppShell() {
  const { t } = useApp();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<TabId>("today");

  // Lifted simulator state — also drives Atmosphere on Simulator/Impact tabs.
  const [sp, setSp] = useState<number | null>(null);
  const [pr, setPr] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  const [toastOpen, setToastOpen] = useState(false);
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
    if (tab === "today" || tab === "settings") {
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
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3500);

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
          title: "DroughtCast · AquaAlert",
          body: `${stage} forecast — reservoir at ${Math.round(curve[5])}% by month +6.`,
        },
        trigger: null,
      });
    } catch {
      // Notifications are a nice-to-have; UI toast already fired.
    }
  }, [rows, models]);

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#0B2A4A" }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Text style={{ color: "#FF8A6B" }}>{t.app.errorPrefix} {error}</Text>
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
            {t.app.loading}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const last = rows[rows.length - 1];
  const useSp = sp ?? last.snowpack;
  const usePr = pr ?? last.precip;
  const useMo = month ?? last.month;

  // Forecast worst-stage drives "high risk" UI on Today; impactInfo.stage
  // drives it on Impact (slider-driven).
  const todayWorst = (() => {
    const curve = forecastCurve(models, rows, last.snowpack, last.precip, last.month);
    return curve.reduce<{ stage: ReturnType<typeof classify> }>(
      (acc, v) => {
        const s = classify(v);
        return STAGE_RANK[s] > STAGE_RANK[acc.stage] ? { stage: s } : acc;
      },
      { stage: "Normal" },
    );
  })();

  const todayElevated = STAGE_RANK[todayWorst.stage] >= STAGE_RANK.Watch;
  const impactElevated =
    impactInfo != null && STAGE_RANK[impactInfo.stage] >= STAGE_RANK.Watch;

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
              <>
                <TodayTab
                  rows={rows}
                  models={models}
                  onDemo={onDemo}
                  demoFired={demoFired}
                />
                <PersonalizedAlert stage={todayWorst.stage} />
                {todayElevated ? <RecommendedActions /> : null}
              </>
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
              <>
                <ImpactTab stage={impactInfo.stage} pct={impactInfo.pct} />
                {impactElevated ? <RecommendedActions /> : null}
              </>
            ) : (
              <SettingsTab rows={rows} />
            )}
          </ScrollView>
        </SafeAreaView>
      </Atmosphere>

      <PushToast
        visible={toastOpen}
        onClose={() => setToastOpen(false)}
        stage={atmosphereStage}
        pct={impactInfo?.pct ?? last.reservoir}
        monthLabel={monthLabel(useMo, 6)}
      />

      <TabBar active={tab} onChange={setTab} />
      <StatusBar style="light" />
    </View>
  );
}

function monthLabel(startMonth: number, k: number) {
  const names = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const m = ((startMonth - 1 + k) % 12) + 1;
  return names[m - 1];
}
