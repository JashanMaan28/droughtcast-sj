import type { Strings } from "../types";

const pa: Strings = {
  language: {
    code: "pa",
    englishName: "Punjabi",
    nativeName: "ਪੰਜਾਬੀ",
  },

  app: {
    loading: "ਸੋਕੇ ਦਾ ਮਾਡਲ ਸਿਖਾਇਆ ਜਾ ਰਿਹਾ ਹੈ…",
    errorPrefix: "ਡਾਟਾ ਲੋਡ ਨਹੀਂ ਹੋਇਆ:",
  },

  tabs: {
    today: "ਅੱਜ",
    sim: "ਸਿਮੂਲੇਟਰ",
    impact: "ਅਸਰ",
    about: "ਬਾਰੇ",
  },

  stages: {
    Normal: "ਆਮ",
    Watch: "ਨਿਗਰਾਨੀ",
    Warning: "ਚੇਤਾਵਨੀ",
    Emergency: "ਐਮਰਜੈਂਸੀ",
  },

  stageText: {
    Normal: "ਜਲ ਭੰਡਾਰ ਠੀਕ-ਠਾਕ। ਕੋਈ ਲਾਜ਼ਮੀ ਪਾਬੰਦੀ ਨਹੀਂ।",
    Watch: "ਸਵੈ-ਇੱਛਤ 10% ਕਟੌਤੀ। ਸਿੰਚਾਈ ਉੱਤੇ ਨਜ਼ਰ ਰੱਖੋ।",
    Warning:
      "ਪੜਾਅ 2: 15% ਲਾਜ਼ਮੀ ਕਟੌਤੀ। ਬਾਹਰੀ ਪਾਣੀ ਦੇਣ ਉੱਤੇ ਪਾਬੰਦੀ।",
    Emergency:
      "ਪੜਾਅ 4: 30%+ ਕਟੌਤੀਆਂ। ਖੇਤੀ ਲਈ ਅਲਾਟਮੈਂਟ ਬਹੁਤ ਘਟਾਈ ਗਈ।",
  },

  severityHeadline: {
    Normal: "ਕੋਈ ਕਾਰਵਾਈ ਦੀ ਲੋੜ ਨਹੀਂ",
    Watch: "ਸਵੈ-ਇੱਛਾ ਨਾਲ ਬੱਚਤ ਕਰੋ",
    Warning: "ਪਾਬੰਦੀਆਂ ਲਾਗੂ ਹਨ",
    Emergency: "ਐਮਰਜੈਂਸੀ ਘੋਸ਼ਿਤ",
  },

  today: {
    location: "ਸੈਨ ਖੋਆਕੀਨ",
    aquaalertActive: "AQUAALERT · ਸਰਗਰਮ",
    stageHeadline: (stage) => `${stage} ਪੜਾਅ`,
    forecastSummary: ({ month, pct }) =>
      `${month} ਤੱਕ ਅਨੁਮਾਨ · ਜਲ ਭੰਡਾਰ ${Math.round(pct)}%`,
    notifyAction: "ਪੜਾਅ ਬਦਲਣ ਉੱਤੇ ਮੈਨੂੰ ਸੂਚਿਤ ਕਰੋ",
    notifySent: "✓ ਅਲਰਟ ਤੁਹਾਡੇ ਫ਼ੋਨ ਤੇ ਭੇਜਿਆ",
    currentReservoir: "ਮੌਜੂਦਾ ਜਲ ਭੰਡਾਰ",
    forecast12mo: "12-ਮਹੀਨੇ ਦਾ ਅਨੁਮਾਨ",
    snowpack: "ਬਰਫ਼",
    precip: "ਮੀਂਹ",
    ofNormal: "ਆਮ ਨਾਲੋਂ",
  },

  sim: {
    title: "ਸਿਮੂਲੇਟਰ",
    sub: "ਜੇ ਹਾਲਾਤ ਬਦਲ ਜਾਣ ਤਾਂ?",
    predictedIn6Mo: "6 ਮਹੀਨਿਆਂ ਵਿੱਚ ਅਨੁਮਾਨ",
    deltaSummary: ({ delta, stage }) =>
      `${delta} pp ਅੱਜ ਨਾਲੋਂ · ${stage}`,
    historyForecast: "24 ਮ. ਇਤਿਹਾਸ · 12 ਮ. ਅਨੁਮਾਨ",
    snowpack: "ਬਰਫ਼",
    precipitation: "ਵਰਖਾ",
    startMonth: "ਸ਼ੁਰੂਆਤੀ ਮਹੀਨਾ",
    pctOfNormal: "% ਆਮ ਨਾਲੋਂ",
    reset: "ਮੌਜੂਦਾ ਉੱਤੇ ਰੀਸੈੱਟ ਕਰੋ",
    horizons: "ਹੋਰਾਈਜ਼ਨ",
  },

  impact: {
    title: "ਸਥਾਨਕ ਅਸਰ",
    sub: (pct) => `ਜਲ ਭੰਡਾਰ ${Math.round(pct)}%`,
    severityPrefix: "ਗੰਭੀਰਤਾ",
    household: "ਘਰੇਲੂ",
    farmAllocation: "ਖੇਤੀ ਅਲਾਟਮੈਂਟ",
    reservoirs: "ਜਲ ਭੰਡਾਰ",
    economicImpact: "ਆਰਥਿਕ ਅਸਰ",
    gallonsPerDay: "ਗੈਲਨ/ਦਿਨ",
    pctOfNormal: "% ਆਮ ਨਾਲੋਂ",
    shower: "ਨਹਾਉਣਾ",
    lawn: "ਘਾਹ",
    pool: "ਪੂਲ",
    acresFallowed: "ਖਾਲੀ ਛੱਡੇ ਏਕੜ",
    level: "ਪੱਧਰ",
    boating: "ਕਿਸ਼ਤੀ",
    fishing: "ਮੱਛੀ ਫੜਨਾ",
    cropLoss: "ਫ਼ਸਲ ਦਾ ਨੁਕਸਾਨ",
    jobsAtRisk: "ਖ਼ਤਰੇ ਵਿੱਚ ਨੌਕਰੀਆਂ",

    householdLabel: {
      Normal: "ਕੋਈ ਪਾਬੰਦੀ ਨਹੀਂ",
      Watch: "ਸਵੈ-ਇੱਛਤ 10% ਕਟੌਤੀ",
      Warning: "ਲਾਜ਼ਮੀ 15% ਕਟੌਤੀ",
      Emergency: "ਲਾਜ਼ਮੀ 25% ਕਟੌਤੀ · $500 ਜੁਰਮਾਨਾ",
    },
    farmLabel: {
      Normal: "ਪੂਰੀ ਅਲਾਟਮੈਂਟ",
      Watch: "20% ਘਟਾਓ",
      Warning: "45% ਘਟਾਓ",
      Emergency: "70% ਘਟਾਓ",
    },
    showerVal: {
      Normal: "ਅਸੀਮਤ",
      Watch: "5 ਮਿੰਟ",
      Warning: "4 ਮਿੰਟ",
      Emergency: "2 ਮਿੰਟ",
    },
    lawnVal: {
      Normal: "ਹਰ ਦਿਨ",
      Watch: "ਟਾਂਕ ਦਿਨ",
      Warning: "ਹਫ਼ਤੇ ਵਿੱਚ 1 ਦਿਨ",
      Emergency: "ਪਾਬੰਦੀ",
    },
    poolVal: {
      Normal: "ਖੁੱਲ੍ਹਾ",
      Watch: "ਖੁੱਲ੍ਹਾ",
      Warning: "ਮੁੜ ਨਹੀਂ ਭਰਨਾ",
      Emergency: "ਬੰਦ",
    },
    reservoirLevel: {
      Normal: "ਉੱਚਾ",
      Watch: "ਔਸਤ ਤੋਂ ਘੱਟ",
      Warning: "ਘੱਟ",
      Emergency: "ਨਾਜ਼ੁਕ",
    },
    reservoirBoating: {
      Normal: "ਖੁੱਲ੍ਹਾ",
      Watch: "ਖੁੱਲ੍ਹਾ",
      Warning: "ਪਾਬੰਦੀ",
      Emergency: "ਬੰਦ",
    },
    reservoirFishing: {
      Normal: "ਖੁੱਲ੍ਹਾ",
      Watch: "ਖੁੱਲ੍ਹਾ",
      Warning: "ਸਿਰਫ਼ ਪਰਮਿਟ ਨਾਲ",
      Emergency: "ਬੰਦ",
    },
  },

  about: {
    title: "ਬਾਰੇ",
    sub: "ਤਰੀਕਾ ਅਤੇ ਸਰੋਤ",
    method: "ਤਰੀਕਾ",
    methodBody:
      "ਡਿਵਾਈਸ ਉੱਤੇ ਹੀ ਸਿੱਖੇ ਚਾਰ ਮਲਟੀਵੇਰੀਏਟ ਲੀਨੀਅਰ ਰੀਗਰੈਸ਼ਨ — ਹਰ ਅਨੁਮਾਨ ਹੋਰਾਈਜ਼ਨ (1, 3, 6, 12 ਮਹੀਨੇ) ਲਈ ਇੱਕ। ਫ਼ੀਚਰ: ਮੌਜੂਦਾ ਬਰਫ਼ ਅਤੇ ਵਰਖਾ (ਆਮ ਦਾ %), 3 ਮਹੀਨੇ ਪੁਰਾਣੀ ਬਰਫ਼ ਅਤੇ ਵਰਖਾ, ਅਤੇ ਮਹੀਨੇ ਦੀ sin/cos ਮੌਸਮੀਅਤ। 12-ਮਹੀਨੇ ਦੀ ਕਰਵ ਇਹਨਾਂ ਚਾਰ ਐਂਕਰਾਂ ਵਿਚਕਾਰ ਇੰਟਰਪੋਲੇਟ ਕਰਦੀ ਹੈ।",
    modelFit: "ਮਾਡਲ ਫਿੱਟ (R² ਇਨ-ਸੈਂਪਲ)",
    horizonLabel: (m) => `+${m} ਮਹੀਨੇ`,
    source: "ਸਰੋਤ",
    dataset: "ਡਾਟਾਸੈੱਟ",
    datasetValue: "H2O Hackathon Challenge",
    endpoint: "ਐਂਡਪੁਆਇੰਟ",
    coverage: "ਕਵਰੇਜ",
    records: "ਰਿਕਾਰਡ",
    recordsValue: (n) => `${n} ਮਹੀਨੇ`,
    region: "ਖੇਤਰ",
    regionValue: "ਸੈਨ ਖੋਆਕੀਨ ਕਾਊਂਟੀ, CA",
    stageThresholds: "ਪੜਾਅ ਦੀਆਂ ਹੱਦਾਂ",
    thresholdRange: {
      Normal: "ਜਲ ਭੰਡਾਰ > 85%",
      Watch: "75 – 85%",
      Warning: "65 – 75%",
      Emergency: "< 65%",
    },
    disclaimer:
      "ਹੈਕਾਥਾਨ ਪ੍ਰੋਟੋਟਾਈਪ। ਇਸ ਅਧਾਰ ਉੱਤੇ ਸਿੰਚਾਈ ਦੇ ਫ਼ੈਸਲੇ ਨਾ ਲਓ।",
  },

  toast: {
    brand: "DROUGHTCAST",
    nowAdv: "ਹੁਣੇ",
    forecastSummary: ({ stage, pct, month }) =>
      `${stage} ਅਨੁਮਾਨ — ${month} ਤੱਕ ${Math.round(pct)}%`,
  },
};

export default pa;
