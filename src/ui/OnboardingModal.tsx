import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useApp } from "../context/AppContext";
import type { Role } from "../i18n/types";
import { LanguageMenu } from "./LanguageMenu";
import { TOKENS } from "./tokens";

const ROLES: Role[] = ["farmer", "resident", "school", "business", "planner"];

export function OnboardingModal() {
  const { showOnboarding, setRole, skipOnboarding, t, locale, setLocale } =
    useApp();
  const [picked, setPicked] = useState<Role | null>(null);
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!showOnboarding) {
      setPicked(null);
      return;
    }
    reveal.setValue(0);
    Animated.timing(reveal, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [showOnboarding, reveal]);

  const ty = reveal.interpolate({ inputRange: [0, 1], outputRange: [16, 0] });

  return (
    <Modal
      visible={showOnboarding}
      transparent
      animationType="fade"
      onRequestClose={skipOnboarding}
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(4,10,20,0.62)",
          justifyContent: "flex-end",
        }}
      >
        <Pressable
          accessibilityLabel={t.onboarding.skip}
          onPress={skipOnboarding}
          style={{ flex: 1 }}
        />
        <Animated.View
          style={{
            opacity: reveal,
            transform: [{ translateY: ty }],
            paddingHorizontal: 14,
            paddingBottom: 32,
          }}
        >
          <View
            style={{
              borderRadius: 28,
              overflow: "hidden",
              borderWidth: 0.5,
              borderColor: TOKENS.glassEdge,
              backgroundColor: "#0F1A2E",
              shadowColor: "#000",
              shadowOpacity: 0.5,
              shadowRadius: 28,
              shadowOffset: { width: 0, height: 14 },
              elevation: 18,
            }}
          >
            <View style={{ paddingHorizontal: 22, paddingTop: 18, paddingBottom: 22 }}>
              <View
                style={{
                  width: 40,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: "rgba(255,255,255,0.22)",
                  alignSelf: "center",
                  marginBottom: 20,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: TOKENS.textMid,
                    letterSpacing: 1.2,
                    fontWeight: "700",
                  }}
                >
                  DROUGHTCAST
                </Text>
                <LanguageMenu
                  value={locale}
                  onChange={setLocale}
                  align="right"
                />
              </View>
              <Text
                style={{
                  fontSize: 26,
                  color: TOKENS.textHi,
                  fontWeight: "600",
                  letterSpacing: -0.6,
                  marginTop: 12,
                  lineHeight: 32,
                }}
                accessibilityRole="header"
              >
                {t.onboarding.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: TOKENS.textMid,
                  marginTop: 6,
                  lineHeight: 20,
                }}
              >
                {t.onboarding.sub}
              </Text>

              <View style={{ marginTop: 20, gap: 10 }}>
                {ROLES.map((r) => (
                  <RoleRow
                    key={r}
                    role={r}
                    label={t.roles.label[r]}
                    sub={t.roles.sub[r]}
                    selected={picked === r}
                    onPick={setPicked}
                  />
                ))}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  marginTop: 22,
                }}
              >
                <Pressable
                  onPress={skipOnboarding}
                  accessibilityRole="button"
                  accessibilityLabel={t.onboarding.skip}
                  style={({ pressed }) => ({
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 14,
                    borderWidth: 0.5,
                    borderColor: TOKENS.glassEdge,
                    alignItems: "center",
                    backgroundColor: pressed
                      ? "rgba(255,255,255,0.10)"
                      : "transparent",
                    minHeight: 48,
                    justifyContent: "center",
                  })}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: TOKENS.textMid,
                      fontWeight: "500",
                    }}
                  >
                    {t.onboarding.skip}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => picked && setRole(picked)}
                  disabled={!picked}
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !picked }}
                  accessibilityLabel={t.onboarding.cta}
                  style={({ pressed }) => ({
                    flex: 1.4,
                    paddingVertical: 14,
                    borderRadius: 14,
                    alignItems: "center",
                    backgroundColor: picked
                      ? pressed
                        ? "#9DD8F0"
                        : "#A8E6FF"
                      : "rgba(255,255,255,0.16)",
                    minHeight: 48,
                    justifyContent: "center",
                  })}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: picked ? "#0c4a6e" : TOKENS.textLo,
                      fontWeight: "700",
                      letterSpacing: -0.1,
                    }}
                  >
                    {t.onboarding.cta}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function RoleRow({
  role,
  label,
  sub,
  selected,
  onPick,
}: {
  role: Role;
  label: string;
  sub: string;
  selected: boolean;
  onPick: (r: Role) => void;
}) {
  return (
    <Pressable
      onPress={() => onPick(role)}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}. ${sub}`}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 18,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: selected ? "#A8E6FF" : "rgba(255,255,255,0.16)",
        backgroundColor: selected
          ? "rgba(168,230,255,0.12)"
          : pressed
            ? "rgba(255,255,255,0.08)"
            : "rgba(255,255,255,0.04)",
        minHeight: 64,
      })}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 17,
            color: "#FFFFFF",
            fontWeight: selected ? "600" : "500",
            letterSpacing: -0.2,
          }}
          numberOfLines={1}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.62)",
            marginTop: 2,
            lineHeight: 17,
          }}
          numberOfLines={1}
        >
          {sub}
        </Text>
      </View>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          borderWidth: 1.5,
          borderColor: selected ? "#A8E6FF" : "rgba(255,255,255,0.4)",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected ? (
          <View
            style={{
              width: 11,
              height: 11,
              borderRadius: 5.5,
              backgroundColor: "#A8E6FF",
            }}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

export function RoleGlyph({ role, active }: { role: Role; active: boolean }) {
  const stroke = active ? "#A8E6FF" : TOKENS.textMid;
  const sw = 1.6;
  const path = (() => {
    if (role === "farmer") {
      return (
        <>
          <Path
            d="M4 18c4-1 7-5 8-10 1 5 4 9 8 10"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            fill="none"
          />
          <Path d="M12 18v3" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </>
      );
    }
    if (role === "resident") {
      return (
        <Path
          d="M3 12L12 4l9 8M5 10v10h14V10"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      );
    }
    if (role === "school") {
      return (
        <>
          <Path
            d="M3 9l9-4 9 4-9 4-9-4z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M7 11v4c2 1.5 3.5 2 5 2s3-.5 5-2v-4"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            fill="none"
          />
        </>
      );
    }
    if (role === "business") {
      return (
        <>
          <Path
            d="M4 8h16v12H4z"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
            fill="none"
          />
          <Path
            d="M9 8V6a3 3 0 016 0v2"
            stroke={stroke}
            strokeWidth={sw}
            strokeLinecap="round"
            fill="none"
          />
        </>
      );
    }
    return (
      <>
        <Path
          d="M3 21h18M5 21V9l4-2v14M13 21V11l6-2v12"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
          fill="none"
        />
      </>
    );
  })();

  return (
    <View
      style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: active ? "rgba(168,230,255,0.16)" : "rgba(255,255,255,0.08)",
      }}
    >
      <Svg width={20} height={20} viewBox="0 0 24 24">
        {path}
      </Svg>
    </View>
  );
}
