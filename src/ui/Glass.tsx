import { BlurView } from "expo-blur";
import type { ViewStyle } from "react-native";
import { Platform, View } from "react-native";

export function Glass({
  children,
  style,
  intensity = 50,
  dark = false,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  dark?: boolean;
}) {
  const tint = dark ? "dark" : "default";
  const fallbackBg = dark ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.14)";

  // expo-blur on Android does not really blur — supply a translucent tint to
  // keep the glass illusion.
  const androidTint = dark ? "rgba(0,0,0,0.30)" : "rgba(255,255,255,0.18)";

  return (
    <View
      style={[
        {
          borderRadius: 22,
          overflow: "hidden",
          borderWidth: 0.5,
          borderColor: "rgba(255,255,255,0.22)",
          backgroundColor:
            Platform.OS === "android" ? androidTint : fallbackBg,
        },
        style,
      ]}
    >
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={intensity}
          tint={tint}
          style={{ flex: 1 }}
        >
          {children}
        </BlurView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
    </View>
  );
}
