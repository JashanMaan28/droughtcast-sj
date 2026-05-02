import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { LANGUAGES } from "../i18n";
import type { LanguageInfo, Locale } from "../i18n/types";
import { TOKENS } from "./tokens";

/**
 * Controlled dropdown for selecting a UI locale.
 *
 * - Trigger pill shows the current locale code (uppercased) + chevron.
 * - Tapping the trigger opens a Modal-backed dropdown panel anchored
 *   below the trigger; tapping the backdrop or any item closes it.
 * - Each item shows the ISO code, native name, and English name.
 *
 * Not yet wired to any screen — drop it into a header or settings panel
 * later and pass a controlled `value` / `onChange` pair.
 */
export function LanguageMenu({
  value,
  onChange,
  style,
  align = "right",
}: {
  value: Locale;
  onChange: (locale: Locale) => void;
  style?: StyleProp<ViewStyle>;
  /** Which edge of the trigger the panel snaps to. */
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{
    x: number;
    y: number;
    w: number;
    h: number;
  } | null>(null);
  const triggerRef = useRef<View>(null);

  const current = LANGUAGES.find((l) => l.code === value) ?? LANGUAGES[0];

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    triggerRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ x, y, w, h });
      setOpen(true);
    });
  };

  const close = () => setOpen(false);

  return (
    <>
      <View ref={triggerRef} collapsable={false} style={style}>
        <Pressable
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={`Language: ${current.englishName}. Tap to change.`}
          accessibilityState={{ expanded: open }}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            minHeight: 36,
            borderRadius: 999,
            borderWidth: 0.5,
            borderColor: TOKENS.glassEdge,
            backgroundColor: pressed
              ? "rgba(255,255,255,0.18)"
              : "rgba(255,255,255,0.10)",
          })}
        >
          <Text
            style={{
              fontSize: 11,
              color: TOKENS.textHi,
              fontWeight: "600",
              letterSpacing: 1.2,
            }}
          >
            {current.code.toUpperCase()}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: TOKENS.textMid,
              letterSpacing: -0.1,
            }}
            numberOfLines={1}
          >
            {current.nativeName}
          </Text>
          <Chevron open={open} />
        </Pressable>
      </View>

      <DropdownPanel
        visible={open}
        anchor={anchor}
        align={align}
        languages={LANGUAGES}
        value={value}
        onPick={(loc) => {
          onChange(loc);
          close();
        }}
        onDismiss={close}
      />
    </>
  );
}

function Chevron({ open }: { open: boolean }) {
  const a = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(a, {
      toValue: open ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [a, open]);
  const rot = a.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });
  return (
    <Animated.View style={{ transform: [{ rotate: rot }] }}>
      <Svg width={10} height={10} viewBox="0 0 24 24">
        <Path
          d="M6 9l6 6 6-6"
          stroke={TOKENS.textHi}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
}

function DropdownPanel({
  visible,
  anchor,
  align,
  languages,
  value,
  onPick,
  onDismiss,
}: {
  visible: boolean;
  anchor: { x: number; y: number; w: number; h: number } | null;
  align: "left" | "right";
  languages: LanguageInfo[];
  value: Locale;
  onPick: (l: Locale) => void;
  onDismiss: () => void;
}) {
  const reveal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(reveal, {
      toValue: visible ? 1 : 0,
      duration: visible ? 180 : 140,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [reveal, visible]);

  if (!anchor) return null;

  const PANEL_W = 224;
  const GAP = 8;

  // Snap the panel to the trigger's edge based on `align`.
  const left =
    align === "right"
      ? Math.max(8, anchor.x + anchor.w - PANEL_W)
      : Math.min(anchor.x, 9999);
  const top = anchor.y + anchor.h + GAP;

  const ty = reveal.interpolate({
    inputRange: [0, 1],
    outputRange: [-6, 0],
  });

  const PanelInner = Platform.OS === "ios" ? BlurView : View;
  const innerProps =
    Platform.OS === "ios"
      ? { intensity: 60, tint: "dark" as const }
      : ({} as object);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
      statusBarTranslucent
    >
      <Pressable
        accessibilityLabel="Dismiss language menu"
        onPress={onDismiss}
        style={{ flex: 1, backgroundColor: "transparent" }}
      >
        <Animated.View
          // Stop the parent backdrop from receiving the tap.
          onStartShouldSetResponder={() => true}
          style={{
            position: "absolute",
            top,
            left,
            width: PANEL_W,
            opacity: reveal,
            transform: [{ translateY: ty }],
            shadowColor: "#000",
            shadowOpacity: 0.45,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 14,
          }}
        >
          <View
            style={{
              borderRadius: 16,
              overflow: "hidden",
              borderWidth: 0.5,
              borderColor: TOKENS.glassEdge,
              backgroundColor:
                Platform.OS === "ios"
                  ? "rgba(20,28,42,0.55)"
                  : "rgba(11,16,28,0.96)",
            }}
          >
            <PanelInner {...innerProps} style={{ paddingVertical: 6 }}>
              {languages.map((l, i) => (
                <LanguageItem
                  key={l.code}
                  lang={l}
                  selected={l.code === value}
                  divider={i < languages.length - 1}
                  onPick={onPick}
                />
              ))}
            </PanelInner>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

function LanguageItem({
  lang,
  selected,
  divider,
  onPick,
}: {
  lang: LanguageInfo;
  selected: boolean;
  divider: boolean;
  onPick: (l: Locale) => void;
}) {
  return (
    <Pressable
      onPress={() => onPick(lang.code)}
      accessibilityRole="menuitem"
      accessibilityState={{ selected }}
      accessibilityLabel={`${lang.englishName} — ${lang.nativeName}`}
      style={({ pressed }) => ({
        paddingHorizontal: 14,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        minHeight: 44,
        backgroundColor: pressed ? "rgba(255,255,255,0.10)" : "transparent",
        borderBottomWidth: divider ? 0.5 : 0,
        borderColor: TOKENS.divider,
      })}
    >
      <Text
        style={{
          fontSize: 11,
          color: selected ? TOKENS.textHi : TOKENS.textLo,
          fontWeight: "600",
          letterSpacing: 1.2,
          width: 26,
        }}
      >
        {lang.code.toUpperCase()}
      </Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            color: TOKENS.textHi,
            fontWeight: selected ? "600" : "500",
            letterSpacing: -0.1,
          }}
        >
          {lang.nativeName}
        </Text>
        {lang.englishName !== lang.nativeName ? (
          <Text
            style={{
              fontSize: 11,
              color: TOKENS.textLo,
              marginTop: 1,
            }}
          >
            {lang.englishName}
          </Text>
        ) : null}
      </View>
      {selected ? (
        <Svg width={14} height={14} viewBox="0 0 24 24">
          <Path
            d="M5 12l5 5L20 7"
            stroke="#A8E6FF"
            strokeWidth={2.4}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      ) : null}
    </Pressable>
  );
}
