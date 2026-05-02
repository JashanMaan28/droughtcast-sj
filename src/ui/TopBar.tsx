import { Text, View } from "react-native";
import { TOKENS } from "./tokens";

export function TopBar({ title, sub }: { title: string; sub?: string }) {
  return (
    <View style={{ paddingHorizontal: 22, paddingTop: 8, paddingBottom: 6, alignItems: "center" }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: "500",
          color: TOKENS.textHi,
          letterSpacing: -0.6,
          lineHeight: 32,
        }}
        accessibilityRole="header"
      >
        {title}
      </Text>
      {sub ? (
        <Text
          style={{
            fontSize: 13,
            color: TOKENS.textMid,
            marginTop: 2,
            letterSpacing: -0.1,
          }}
        >
          {sub}
        </Text>
      ) : null}
    </View>
  );
}
