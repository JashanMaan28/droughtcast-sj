import { Pressable, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useApp } from "../context/AppContext";
import type { Role } from "../i18n/types";
import type { Row } from "../types";
import { Glass } from "../ui/Glass";
import { LanguageMenu } from "../ui/LanguageMenu";
import { RoleGlyph } from "../ui/OnboardingModal";
import { TopBar } from "../ui/TopBar";
import { TOKENS } from "../ui/tokens";

const ROLES: Role[] = ["farmer", "resident", "school", "business", "planner"];

export function SettingsTab({ rows }: { rows: Row[] }) {
  const { locale, setLocale, role, setRole, t } = useApp();

  const first = rows[0];
  const last = rows[rows.length - 1];
  const span = `${first.date.toLocaleDateString(undefined, { month: "short", year: "numeric" })} – ${last.date.toLocaleDateString(undefined, { month: "short", year: "numeric" })}`;

  return (
    <View>
      <TopBar title={t.settings.title} sub={t.settings.sub} />

      {/* Language */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
          <SectionEyebrow label={t.settings.languageSection} />
          <View
            style={{
              marginTop: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <Text
              style={{
                flex: 1,
                fontSize: 13,
                color: TOKENS.textMid,
                lineHeight: 18,
              }}
            >
              {t.onboarding.sub}
            </Text>
            <LanguageMenu value={locale} onChange={setLocale} align="right" />
          </View>
        </View>
      </Glass>

      {/* Role / occupation */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingTop: 16, paddingBottom: 6 }}>
          <SectionEyebrow label={t.settings.profileSection} />
          <Text
            style={{
              fontSize: 12,
              color: TOKENS.textLo,
              marginTop: 4,
            }}
          >
            {t.settings.profileHint}
          </Text>
        </View>
        <View style={{ paddingHorizontal: 12, paddingBottom: 12, gap: 6 }}>
          {ROLES.map((r) => (
            <RoleOption
              key={r}
              role={r}
              label={t.roles.label[r]}
              sub={t.roles.sub[r]}
              selected={role === r}
              onPick={() => setRole(r)}
            />
          ))}
        </View>
      </Glass>

      {/* Method */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
          <SectionEyebrow label={t.settings.methodSection} />
          <Text
            style={{
              fontSize: 13,
              color: TOKENS.textHi,
              marginTop: 8,
              lineHeight: 20,
            }}
          >
            {t.settings.methodBody}
          </Text>
        </View>
      </Glass>

      {/* Source */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
          <SectionEyebrow label={t.settings.sourceSection} />
          <View style={{ marginTop: 8 }}>
            <RowItem label={t.settings.dataset} value={t.settings.datasetValue} />
            <RowItem label={t.settings.endpoint} value="scoringapi.h2ohackathon.org" />
            <RowItem label={t.settings.coverage} value={span} />
            <RowItem
              label={t.settings.records}
              value={t.settings.recordsValue(rows.length)}
            />
            <RowItem label={t.settings.region} value={t.settings.regionValue} />
          </View>
        </View>
      </Glass>

      {/* Stage thresholds */}
      <Glass style={{ marginHorizontal: 14, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 18, paddingVertical: 16 }}>
          <SectionEyebrow label={t.settings.thresholdsSection} />
          <View style={{ marginTop: 8 }}>
            <ThresholdRow
              color="#A8E6FF"
              label={t.stages.Normal}
              range={t.settings.thresholdRange.Normal}
            />
            <ThresholdRow
              color="#C7E5C0"
              label={t.stages.Watch}
              range={t.settings.thresholdRange.Watch}
            />
            <ThresholdRow
              color="#FFCB7A"
              label={t.stages.Warning}
              range={t.settings.thresholdRange.Warning}
            />
            <ThresholdRow
              color="#FF8A6B"
              label={t.stages.Emergency}
              range={t.settings.thresholdRange.Emergency}
            />
          </View>
        </View>
      </Glass>

      {/* Disclaimer */}
      <View
        style={{
          marginHorizontal: 14,
          marginBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Svg width={11} height={11} viewBox="0 0 24 24">
            <Path
              d="M12 9v4M12 17h0"
              stroke={TOKENS.textLo}
              strokeWidth={1.6}
              strokeLinecap="round"
            />
            <Path
              d="M12 3l10 18H2L12 3z"
              stroke={TOKENS.textLo}
              strokeWidth={1.4}
              fill="none"
            />
          </Svg>
          <Text
            style={{
              flex: 1,
              fontSize: 11,
              color: TOKENS.textLo,
              letterSpacing: 0.3,
            }}
          >
            {t.settings.disclaimer}
          </Text>
        </View>
      </View>
    </View>
  );
}

function SectionEyebrow({ label }: { label: string }) {
  return (
    <Text
      style={{
        fontSize: 11,
        color: TOKENS.textMid,
        letterSpacing: 0.6,
        fontWeight: "500",
      }}
    >
      {label}
    </Text>
  );
}

function RowItem({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderBottomWidth: 0.5,
        borderColor: TOKENS.divider,
      }}
    >
      <Text style={{ fontSize: 12, color: TOKENS.textMid }}>{label}</Text>
      <Text
        style={{
          fontSize: 12,
          color: TOKENS.textHi,
          fontWeight: "500",
          letterSpacing: -0.1,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function ThresholdRow({
  color,
  label,
  range,
}: {
  color: string;
  label: string;
  range: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        gap: 10,
      }}
    >
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
        }}
      />
      <Text
        style={{
          fontSize: 12,
          color: TOKENS.textHi,
          fontWeight: "500",
          width: 110,
        }}
      >
        {label}
      </Text>
      <Text style={{ fontSize: 12, color: TOKENS.textMid }}>{range}</Text>
    </View>
  );
}

function RoleOption({
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
  onPick: () => void;
}) {
  return (
    <Pressable
      onPress={onPick}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${label}. ${sub}`}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: selected ? "#A8E6FF" : "rgba(255,255,255,0.10)",
        backgroundColor: selected
          ? "rgba(168,230,255,0.10)"
          : pressed
            ? "rgba(255,255,255,0.06)"
            : "transparent",
        minHeight: 56,
      })}
    >
      <RoleGlyph role={role} active={selected} />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 14,
            color: TOKENS.textHi,
            fontWeight: selected ? "600" : "500",
            letterSpacing: -0.1,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            fontSize: 11,
            color: TOKENS.textLo,
            marginTop: 2,
          }}
        >
          {sub}
        </Text>
      </View>
      {selected ? (
        <Svg width={16} height={16} viewBox="0 0 24 24">
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
