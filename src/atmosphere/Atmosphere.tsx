import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useMemo, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import { STAGE_THEME, type StageTheme } from "../stage";
import type { DroughtStage } from "../types";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedView = Animated.View;

export function Atmosphere({
  stageName,
  width,
  height,
  children,
}: {
  stageName: DroughtStage;
  width: number;
  height: number;
  children?: React.ReactNode;
}) {
  const theme = STAGE_THEME[stageName];

  return (
    <View style={{ width, height, overflow: "hidden" }}>
      <LinearGradient
        colors={theme.gradient}
        locations={theme.gradientStops}
        style={{ position: "absolute", inset: 0 }}
      />

      {/* Halo orb */}
      <Halo accent={theme.accent} top={height * 0.06} right={-90} />

      {/* Stage-specific scene */}
      {theme.kind === "flowing" ? (
        <FlowingWater width={width} height={height} />
      ) : theme.kind === "calm" ? (
        <CalmHorizon width={width} height={height} />
      ) : theme.kind === "cracked" ? (
        <CrackedEarth width={width} height={height} accent={theme.accent} />
      ) : (
        <FracturedEmergency
          width={width}
          height={height}
          accent={theme.accent}
        />
      )}

      {/* Foreground content */}
      <View style={{ position: "absolute", inset: 0 }}>{children}</View>
    </View>
  );
}

function Halo({
  accent,
  top,
  right,
}: {
  accent: string;
  top: number;
  right: number;
}) {
  return (
    <View
      pointerEvents="none"
      style={{ position: "absolute", top, right, width: 360, height: 360 }}
    >
      <Svg width={360} height={360}>
        <Defs>
          <RadialGradient id="halo" cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop offset="0%" stopColor={accent} stopOpacity={0.25} />
            <Stop offset="65%" stopColor={accent} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="360" height="360" fill="url(#halo)" />
      </Svg>
    </View>
  );
}

// NORMAL — flowing reservoir water
function FlowingWater({ width, height }: { width: number; height: number }) {
  const tx = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(tx, {
        toValue: 1,
        duration: 18000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [tx]);

  const offset = tx.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -width],
  });

  return (
    <>
      {/* Wave layer (animated) */}
      <AnimatedView
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: width * 2,
          height: 220,
          transform: [{ translateX: offset }],
        }}
      >
        <Svg
          width={width * 2}
          height={220}
          viewBox="0 0 1600 220"
          preserveAspectRatio="none"
        >
          <Path
            d="M0,140 C200,100 400,180 600,140 C800,100 1000,180 1200,140 L1600,140 L1600,220 L0,220 Z"
            fill="rgba(79,179,204,0.32)"
          />
        </Svg>
      </AnimatedView>
      {/* Static back wave */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 60,
          left: 0,
          width: width * 2,
          height: 180,
        }}
      >
        <Svg
          width={width * 2}
          height={180}
          viewBox="0 0 1600 180"
          preserveAspectRatio="none"
        >
          <Path
            d="M0,90 C200,60 400,130 600,90 C800,60 1000,130 1200,90 L1600,90 L1600,180 L0,180 Z"
            fill="rgba(168,230,255,0.14)"
          />
        </Svg>
      </View>
    </>
  );
}

// WATCH — calm horizon + slow ripples
function CalmHorizon({ width, height }: { width: number; height: number }) {
  const ripples = useMemo(
    () => [
      { left: width * 0.2, top: height * 0.6, dur: 6000, delay: 0 },
      { left: width * 0.7, top: height * 0.7, dur: 7000, delay: 1500 },
      { left: width * 0.45, top: height * 0.78, dur: 8000, delay: 3000 },
      { left: width * 0.8, top: height * 0.55, dur: 9000, delay: 1000 },
    ],
    [width, height],
  );

  return (
    <>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: "rgba(255,255,255,0.18)",
        }}
      />
      {ripples.map((r, i) => (
        <Ripple key={i} {...r} />
      ))}
    </>
  );
}

function Ripple({
  left,
  top,
  dur,
  delay,
}: {
  left: number;
  top: number;
  dur: number;
  delay: number;
}) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(t, {
          toValue: 1,
          duration: dur,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [t, dur, delay]);
  const scale = t.interpolate({ inputRange: [0, 1], outputRange: [0.4, 2.2] });
  const opacity = t.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0],
  });
  return (
    <AnimatedView
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        top,
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.45)",
        opacity,
        transform: [{ scale }],
      }}
    />
  );
}

// WARNING — cracked earth + drifting dust
function CrackedEarth({
  width,
  height,
  accent,
}: {
  width: number;
  height: number;
  accent: string;
}) {
  return (
    <>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width,
          height: 280,
        }}
      >
        <Svg
          width={width}
          height={280}
          viewBox="0 0 400 300"
          preserveAspectRatio="xMidYMax slice"
        >
          <Defs>
            <SvgLinearGradient id="earth" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={accent} stopOpacity={0} />
              <Stop offset="100%" stopColor="#2B0F05" stopOpacity={0.55} />
            </SvgLinearGradient>
          </Defs>
          <Rect x="0" y="100" width="400" height="200" fill="url(#earth)" />
          <Path
            d="M50,120 L80,180 L60,250 M80,180 L130,200 L150,280"
            stroke="rgba(20,8,2,0.6)"
            strokeWidth={1.4}
            fill="none"
          />
          <Path
            d="M180,140 L220,200 L240,260 M220,200 L270,210 L290,280"
            stroke="rgba(20,8,2,0.6)"
            strokeWidth={1.4}
            fill="none"
          />
          <Path
            d="M310,150 L340,220 L320,280 M340,220 L390,240"
            stroke="rgba(20,8,2,0.6)"
            strokeWidth={1.4}
            fill="none"
          />
          <Path
            d="M0,200 L40,230 L70,270 M40,230 L60,290"
            stroke="rgba(20,8,2,0.6)"
            strokeWidth={1.4}
            fill="none"
          />
          <Path
            d="M150,170 L170,230 M170,230 L200,290"
            stroke="rgba(20,8,2,0.6)"
            strokeWidth={1.4}
            fill="none"
          />
          {/* highlight */}
          <Path
            d="M50,120 L80,180 L60,250 M80,180 L130,200 L150,280"
            stroke={accent}
            strokeOpacity={0.25}
            strokeWidth={0.6}
            fill="none"
          />
        </Svg>
      </View>
      <DustMotes width={width} height={height} accent={accent} />
    </>
  );
}

function DustMotes({
  width,
  height,
  accent,
}: {
  width: number;
  height: number;
  accent: string;
}) {
  const motes = useMemo(
    () =>
      [
        { x: 0.2, y: 0.3, s: 3 },
        { x: 0.7, y: 0.45, s: 2 },
        { x: 0.35, y: 0.6, s: 2.5 },
        { x: 0.85, y: 0.25, s: 1.6 },
        { x: 0.55, y: 0.38, s: 2 },
      ].map((m, i) => ({ ...m, delay: i * 700 })),
    [],
  );
  return (
    <>
      {motes.map((m, i) => (
        <DustMote
          key={i}
          left={m.x * width}
          top={m.y * height}
          size={m.s * 2}
          accent={accent}
          delay={m.delay}
        />
      ))}
    </>
  );
}

function DustMote({
  left,
  top,
  size,
  accent,
  delay,
}: {
  left: number;
  top: number;
  size: number;
  accent: string;
  delay: number;
}) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(t, {
          toValue: 1,
          duration: 8000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [t, delay]);
  const tx = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 15, 0] });
  const ty = t.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -8, 0],
  });
  return (
    <AnimatedView
      pointerEvents="none"
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: accent + "B0",
        transform: [{ translateX: tx }, { translateY: ty }],
      }}
    />
  );
}

// EMERGENCY — fractured ground + embers + pulsing band
function FracturedEmergency({
  width,
  height,
  accent,
}: {
  width: number;
  height: number;
  accent: string;
}) {
  const embers = useMemo(
    () =>
      Array.from({ length: 14 }, () => ({
        x: Math.random(),
        delay: Math.random() * 4000,
        dur: 5000 + Math.random() * 4000,
        size: 1.5 + Math.random() * 2,
      })),
    [],
  );
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);
  const bandOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.85],
  });

  return (
    <>
      {/* Fractured ground */}
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width,
          height: 320,
        }}
      >
        <Svg
          width={width}
          height={320}
          viewBox="0 0 400 320"
          preserveAspectRatio="xMidYMax slice"
        >
          <Defs>
            <SvgLinearGradient id="emerEarth" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#7A1F18" stopOpacity={0} />
              <Stop offset="100%" stopColor="#140202" stopOpacity={0.65} />
            </SvgLinearGradient>
          </Defs>
          <Rect x="0" y="80" width="400" height="240" fill="url(#emerEarth)" />
          <Path
            d="M30,100 L60,160 L40,220 L70,290"
            stroke="rgba(10,0,0,0.7)"
            strokeWidth={1.4}
            fill="none"
          />
          <Path
            d="M60,160 L120,180 L140,250 L160,310"
            stroke="rgba(10,0,0,0.7)"
            strokeWidth={1.4}
            fill="none"
          />
          <Path
            d="M120,180 L200,170 L240,230 L260,310"
            stroke="rgba(10,0,0,0.7)"
            strokeWidth={1.4}
            fill="none"
          />
          <Path
            d="M200,170 L280,190 L320,260 L340,310"
            stroke="rgba(10,0,0,0.7)"
            strokeWidth={1.4}
            fill="none"
          />
          <Path
            d="M280,190 L370,180 L390,250"
            stroke="rgba(10,0,0,0.7)"
            strokeWidth={1.4}
            fill="none"
          />
          {/* glowing fissure highlight */}
          <Path
            d="M30,100 L60,160 L40,220 L70,290"
            stroke={accent}
            strokeOpacity={0.7}
            strokeWidth={0.8}
            fill="none"
          />
          <Path
            d="M120,180 L200,170 L240,230 L260,310"
            stroke={accent}
            strokeOpacity={0.6}
            strokeWidth={0.8}
            fill="none"
          />
        </Svg>
      </View>
      {/* Embers */}
      {embers.map((e, i) => (
        <Ember
          key={i}
          left={e.x * width}
          height={height}
          size={e.size}
          accent={accent}
          delay={e.delay}
          dur={e.dur}
        />
      ))}
      {/* Top warning band */}
      <AnimatedView
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          backgroundColor: accent,
          opacity: bandOpacity,
        }}
      />
    </>
  );
}

function Ember({
  left,
  height,
  size,
  accent,
  delay,
  dur,
}: {
  left: number;
  height: number;
  size: number;
  accent: string;
  delay: number;
  dur: number;
}) {
  const t = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(t, {
          toValue: 1,
          duration: dur,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(t, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [t, delay, dur]);
  const ty = t.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -height * 0.85],
  });
  const opacity = t.interpolate({
    inputRange: [0, 0.1, 0.9, 1],
    outputRange: [0, 0.8, 0.6, 0],
  });
  return (
    <AnimatedView
      pointerEvents="none"
      style={{
        position: "absolute",
        bottom: 0,
        left,
        width: size,
        height: size,
        borderRadius: size,
        backgroundColor: accent,
        opacity,
        transform: [{ translateY: ty }],
        shadowColor: accent,
        shadowOpacity: 0.9,
        shadowRadius: size * 2,
      }}
    />
  );
}

export type { StageTheme };
