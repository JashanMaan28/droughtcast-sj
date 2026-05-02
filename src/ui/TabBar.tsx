import { BlurView } from "expo-blur";
import { Platform, Pressable, Text, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { useApp } from "../context/AppContext";

export type TabId = "today" | "sim" | "impact" | "settings";

export function TabBar({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (id: TabId) => void;
}) {
  const { t } = useApp();
  const tabs: { id: TabId; label: string }[] = [
    { id: "today", label: t.tabs.today },
    { id: "sim", label: t.tabs.sim },
    { id: "impact", label: t.tabs.impact },
    { id: "settings", label: t.tabs.settings },
  ];
  const Container = Platform.OS === "ios" ? BlurView : View;
  const containerProps =
    Platform.OS === "ios" ? { intensity: 60, tint: "dark" as const } : {};
  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor:
          Platform.OS === "ios" ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.55)",
        borderTopWidth: 0.5,
        borderColor: "rgba(255,255,255,0.12)",
      }}
    >
      <Container {...containerProps} style={{ paddingBottom: 28 }}>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 8,
          }}
        >
          {tabs.map((t) => {
            const a = active === t.id;
            return (
              <Pressable
                key={t.id}
                onPress={() => onChange(t.id)}
                accessibilityRole="tab"
                accessibilityLabel={`${t.label} tab`}
                accessibilityState={{ selected: a }}
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingVertical: 6,
                  minHeight: 44,
                  justifyContent: "center",
                }}
              >
                <TabIcon id={t.id} active={a} />
                <Text
                  style={{
                    fontSize: 10,
                    color: "#fff",
                    opacity: a ? 1 : 0.55,
                    fontWeight: a ? "600" : "500",
                    marginTop: 4,
                    letterSpacing: 0.2,
                  }}
                >
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Container>
    </View>
  );
}

function TabIcon({ id, active }: { id: TabId; active: boolean }) {
  const s = active ? 1 : 0.55;
  const sw = active ? 2 : 1.5;
  if (id === "today") {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Circle cx={12} cy={12} r={4} fill="#fff" opacity={s} />
        <Path
          d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"
          stroke="#fff"
          strokeWidth={sw}
          strokeLinecap="round"
          opacity={s}
        />
      </Svg>
    );
  }
  if (id === "sim") {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Path
          d="M4 17l5-5 4 4 7-8"
          stroke="#fff"
          strokeWidth={active ? 2.4 : 1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity={s}
        />
      </Svg>
    );
  }
  if (id === "impact") {
    return (
      <Svg width={22} height={22} viewBox="0 0 24 24">
        <Rect
          x={4}
          y={4}
          width={7}
          height={7}
          rx={1.5}
          fill={active ? "#fff" : "transparent"}
          stroke="#fff"
          strokeWidth={1.5}
          opacity={s}
        />
        <Rect
          x={13}
          y={4}
          width={7}
          height={7}
          rx={1.5}
          stroke="#fff"
          strokeWidth={1.5}
          fill="transparent"
          opacity={s}
        />
        <Rect
          x={4}
          y={13}
          width={7}
          height={7}
          rx={1.5}
          stroke="#fff"
          strokeWidth={1.5}
          fill="transparent"
          opacity={s}
        />
        <Rect
          x={13}
          y={13}
          width={7}
          height={7}
          rx={1.5}
          fill={active ? "#fff" : "transparent"}
          stroke="#fff"
          strokeWidth={1.5}
          opacity={s}
        />
      </Svg>
    );
  }
  // settings (gear)
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24">
      <Circle
        cx={12}
        cy={12}
        r={3}
        stroke="#fff"
        strokeWidth={sw}
        fill={active ? "#fff" : "transparent"}
        opacity={s}
      />
      <Path
        d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
        stroke="#fff"
        strokeWidth={sw}
        strokeLinecap="round"
        opacity={s}
      />
    </Svg>
  );
}
