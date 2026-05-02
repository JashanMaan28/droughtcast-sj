import { BlurView } from "expo-blur";
import { useEffect, useRef } from "react";
import { Animated, Easing, Platform, Pressable, Text, View } from "react-native";
import type { DroughtStage } from "../types";
import { STAGE_THEME } from "../stage";

export function PushToast({
  visible,
  onClose,
  stage,
  pct,
  monthLabel,
}: {
  visible: boolean;
  onClose: () => void;
  stage: DroughtStage;
  pct: number;
  monthLabel: string;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 350,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [-120, 0],
  });
  const opacity = anim;

  if (!visible) return null;
  const theme = STAGE_THEME[stage];

  const Container = Platform.OS === "ios" ? BlurView : View;
  const containerProps =
    Platform.OS === "ios" ? { intensity: 70, tint: "dark" as const } : {};

  return (
    <Animated.View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 24,
        left: 16,
        right: 16,
        zIndex: 1000,
        opacity,
        transform: [{ translateY }],
      }}
    >
      <Pressable onPress={onClose} accessibilityRole="alert">
        <Container
          {...containerProps}
          style={{
            borderRadius: 16,
            overflow: "hidden",
            backgroundColor:
              Platform.OS === "ios" ? "rgba(20,20,20,0.6)" : "rgba(20,20,20,0.92)",
            borderWidth: 0.5,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <View
            style={{
              padding: 14,
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.accent,
              }}
            />
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.55)",
                    fontWeight: "500",
                    letterSpacing: 0.4,
                  }}
                >
                  DROUGHTCAST
                </Text>
                <Text
                  style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}
                >
                  now
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: "#fff",
                  fontWeight: "500",
                  marginTop: 2,
                  letterSpacing: -0.2,
                }}
              >
                {stage} forecast — {Math.round(pct)}% by {monthLabel}
              </Text>
            </View>
          </View>
        </Container>
      </Pressable>
    </Animated.View>
  );
}
