import type { DroughtStage } from "../types";

export type Locale = "en" | "es" | "tl" | "pa";

export type LanguageInfo = {
  code: Locale;
  /** English-language label, e.g. "Spanish". */
  englishName: string;
  /** Endonym, e.g. "Español", "ਪੰਜਾਬੀ". */
  nativeName: string;
};

type StageMap = Record<DroughtStage, string>;

/**
 * Canonical translation surface. Every locale file exports an object
 * matching this shape exactly so consumers can `t.tabs.today` etc.
 *
 * Templated phrases (e.g. the toast forecast summary) use functions so
 * each language can handle its own grammar / word order.
 */
export type Strings = {
  language: LanguageInfo;

  app: {
    loading: string;
    /** Prefix shown before the raw error text. */
    errorPrefix: string;
  };

  tabs: {
    today: string;
    sim: string;
    impact: string;
    about: string;
  };

  /** Stage names — short, used as labels and in headlines. */
  stages: StageMap;

  /** Single-sentence stage description. */
  stageText: StageMap;

  /** Headline shown on the Impact tab severity banner. */
  severityHeadline: StageMap;

  today: {
    location: string; // "San Joaquin"
    aquaalertActive: string; // "AQUAALERT · ACTIVE"
    /** Builds e.g. "Watch stage" / "Etapa de vigilancia". */
    stageHeadline: (stage: string) => string;
    /**
     * Builds e.g. "forecasted by Sep · reservoir at 64%".
     */
    forecastSummary: (args: { month: string; pct: number }) => string;
    notifyAction: string;
    notifySent: string;
    currentReservoir: string;
    forecast12mo: string;
    snowpack: string;
    precip: string;
    ofNormal: string;
  };

  sim: {
    title: string;
    sub: string;
    predictedIn6Mo: string;
    /**
     * Builds e.g. "+2.3 pp from today · Watch".
     * `delta` is already-formatted (sign + 1 decimal), `stage` localized.
     */
    deltaSummary: (args: { delta: string; stage: string }) => string;
    historyForecast: string;
    snowpack: string;
    precipitation: string;
    startMonth: string;
    pctOfNormal: string;
    reset: string;
    horizons: string;
  };

  impact: {
    title: string;
    /** Builds e.g. "Reservoir at 64%". */
    sub: (pct: number) => string;
    /** Prefix only — full label is rendered as "{prefix} · {STAGE}". */
    severityPrefix: string;
    household: string;
    farmAllocation: string;
    reservoirs: string;
    economicImpact: string;
    gallonsPerDay: string;
    pctOfNormal: string;
    shower: string;
    lawn: string;
    pool: string;
    acresFallowed: string;
    level: string;
    boating: string;
    fishing: string;
    cropLoss: string;
    jobsAtRisk: string;

    // Per-stage data labels (mirrors src/stage.ts IMPACT data shape).
    householdLabel: StageMap;
    farmLabel: StageMap;
    showerVal: StageMap;
    lawnVal: StageMap;
    poolVal: StageMap;
    reservoirLevel: StageMap;
    reservoirBoating: StageMap;
    reservoirFishing: StageMap;
  };

  about: {
    title: string;
    sub: string;
    method: string;
    methodBody: string;
    modelFit: string;
    /** Builds e.g. "+3 mo". */
    horizonLabel: (months: number) => string;
    source: string;
    dataset: string;
    datasetValue: string;
    endpoint: string;
    coverage: string;
    records: string;
    /** Builds e.g. "168 months". */
    recordsValue: (n: number) => string;
    region: string;
    regionValue: string;
    stageThresholds: string;
    thresholdRange: StageMap;
    disclaimer: string;
  };

  toast: {
    /** Brand label — usually left untranslated. */
    brand: string;
    nowAdv: string; // "now"
    forecastSummary: (args: {
      stage: string;
      pct: number;
      month: string;
    }) => string;
  };
};
