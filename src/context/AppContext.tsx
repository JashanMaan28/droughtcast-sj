import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DEFAULT_LOCALE, getStrings } from "../i18n";
import type { Locale, Role, Strings } from "../i18n/types";

type AppContextValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  /** Selected user role; null means onboarding hasn't completed yet. */
  role: Role | null;
  setRole: (r: Role | null) => void;
  /** Marks the onboarding modal as dismissed without picking a role. */
  skipOnboarding: () => void;
  /** True when the onboarding modal should be visible. */
  showOnboarding: boolean;
  t: Strings;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [role, setRoleState] = useState<Role | null>(null);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  const setRole = useCallback((r: Role | null) => {
    setRoleState(r);
    setOnboardingDismissed(true);
  }, []);

  const skipOnboarding = useCallback(() => {
    setOnboardingDismissed(true);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      locale,
      setLocale,
      role,
      setRole,
      skipOnboarding,
      showOnboarding: !onboardingDismissed && role === null,
      t: getStrings(locale),
    }),
    [locale, role, onboardingDismissed, setRole, skipOnboarding],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
