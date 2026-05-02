import type { Strings } from "../types";

const tl: Strings = {
  language: {
    code: "tl",
    englishName: "Tagalog",
    nativeName: "Tagalog",
  },

  app: {
    loading: "Sinasanay ang modelo ng tagtuyot…",
    errorPrefix: "Hindi nai-load ang datos:",
  },

  tabs: {
    today: "Ngayon",
    sim: "Simulator",
    impact: "Epekto",
    settings: "Mga Setting",
  },

  roles: {
    label: {
      farmer: "Magsasaka",
      resident: "Residente",
      school: "Paaralan",
      business: "Negosyo",
      planner: "Tagaplano ng Lungsod",
    },
    sub: {
      farmer: "Patubig at pagpaplano ng pananim",
      resident: "Paggamit ng tubig sa bahay",
      school: "Operasyon ng paaralan",
      business: "Komersyal na paggamit ng tubig",
      planner: "Pampublikong imprastraktura",
    },
  },

  onboarding: {
    title: "Alin ang pinakaangkop sa iyo?",
    sub: "Ipapasadya namin ang mga alerto at rekomendasyon ayon sa iyong sitwasyon.",
    cta: "Magpatuloy",
    skip: "Laktawan muna",
  },

  personalizedAlert: {
    eyebrow: "PARA SA IYO",
    headline: "Inirerekomenda ngayong linggo",
    body: {
      farmer: "Bawasan ang patubig ng 15% ngayong linggo.",
      resident: "Iwasang diligan ang damuhan.",
      school: "I-pause ang hindi mahahalagang pagdidilig sa labas.",
      business: "Suriin ang mga kagamitang gumagamit ng tubig para sa tagas.",
      planner: "Inirerekomenda ang konserbasyon ng reserba.",
    },
  },

  recommendedActions: {
    title: "Mga Inirerekomendang Aksyon",
    sub: "Mga hakbang na may pinakamalaking epekto sa panahon ng panganib.",
    items: {
      drip: "Lumipat sa drip irrigation",
      delayWatering: "Ipagpaliban ang hindi mahalagang pagdidilig",
      checkLeaks: "Suriin kung may tagas",
      reduceOutdoor: "Bawasan ang paggamit sa labas",
    },
  },

  stages: {
    Normal: "Normal",
    Watch: "Pagbabantay",
    Warning: "Babala",
    Emergency: "Emerhensya",
  },

  stageText: {
    Normal: "Maayos ang reserba ng tubig. Walang sapilitang paghihigpit.",
    Watch:
      "Kusang-loob na 10% na pagbabawas. Bantayan ang patubig.",
    Warning:
      "Yugto 2: sapilitang 15% na pagbawas. May limitasyon sa pagdidilig sa labas.",
    Emergency:
      "Yugto 4: 30%+ na pagbawas. Lubhang nabawasan ang alokasyon sa agrikultura.",
  },

  severityHeadline: {
    Normal: "Walang kailangang gawin",
    Watch: "Magtipid nang kusang-loob",
    Warning: "May ipinatutupad na paghihigpit",
    Emergency: "Ipinahayag na emerhensya",
  },

  today: {
    location: "San Joaquin",
    aquaalertActive: "AQUAALERT · AKTIBO",
    stageHeadline: (stage) => `Yugtong ${stage}`,
    forecastSummary: ({ month, pct }) =>
      `tinataya hanggang ${month} · reserba sa ${Math.round(pct)}%`,
    notifyAction: "Abisuhan ako kapag nagbago ang yugto",
    notifySent: "✓ Naipadala ang alerto sa iyong telepono",
    currentReservoir: "KASALUKUYANG RESERBA",
    forecast12mo: "12-BUWANG TAYA",
    snowpack: "NIYEBE",
    precip: "ULAN",
    ofNormal: "ng normal",
  },

  sim: {
    title: "Simulator",
    sub: "Paano kung magbago ang kalagayan?",
    predictedIn6Mo: "TAYANG SA LOOB NG 6 NA BUWAN",
    deltaSummary: ({ delta, stage }) =>
      `${delta} pp mula ngayon · ${stage}`,
    historyForecast: "24 BUWANG NAKARAAN · 12 BUWANG TAYA",
    snowpack: "Niyebe",
    precipitation: "Pag-uulan",
    startMonth: "Panimulang buwan",
    pctOfNormal: "% ng normal",
    reset: "Ibalik sa kasalukuyan",
    horizons: "MGA SAKLAW",
  },

  impact: {
    title: "Lokal na Epekto",
    sub: (pct) => `Reserba sa ${Math.round(pct)}%`,
    severityPrefix: "BIGAT",
    household: "TAHANAN",
    farmAllocation: "ALOKASYONG PANSAKAHAN",
    reservoirs: "MGA RESERBA",
    economicImpact: "EPEKTONG PANG-EKONOMIYA",
    gallonsPerDay: "gal/araw",
    pctOfNormal: "% ng normal",
    shower: "Paliligo",
    lawn: "Damuhan",
    pool: "Pool",
    acresFallowed: "Ektaryang hindi natanim",
    level: "Lebel",
    boating: "Pamamangka",
    fishing: "Pangingisda",
    cropLoss: "NAWALANG ANI",
    jobsAtRisk: "TRABAHONG NANGANGANIB",

    householdLabel: {
      Normal: "Walang paghihigpit",
      Watch: "Kusang 10% na pagbawas",
      Warning: "Sapilitang 15% na pagbawas",
      Emergency: "Sapilitang 25% na pagbawas · multa $500",
    },
    farmLabel: {
      Normal: "Buong alokasyon",
      Watch: "20% na pagbabawas",
      Warning: "45% na pagbabawas",
      Emergency: "70% na pagbabawas",
    },
    showerVal: {
      Normal: "walang limit",
      Watch: "5 min",
      Warning: "4 min",
      Emergency: "2 min",
    },
    lawnVal: {
      Normal: "araw-araw",
      Watch: "gansal na araw",
      Warning: "1 araw/linggo",
      Emergency: "ipinagbabawal",
    },
    poolVal: {
      Normal: "bukas",
      Watch: "bukas",
      Warning: "walang refill",
      Emergency: "sarado",
    },
    reservoirLevel: {
      Normal: "Mataas",
      Watch: "Pababa sa karaniwan",
      Warning: "Mababa",
      Emergency: "Kritikal",
    },
    reservoirBoating: {
      Normal: "bukas",
      Watch: "bukas",
      Warning: "may paghihigpit",
      Emergency: "sarado",
    },
    reservoirFishing: {
      Normal: "bukas",
      Watch: "bukas",
      Warning: "may permit lamang",
      Emergency: "sarado",
    },
  },

  settings: {
    title: "Mga Setting",
    sub: "I-personalize ang DroughtCast",
    languageSection: "WIKA",
    profileSection: "AKO AY ISANG…",
    profileHint: "Ginagabayan nito ang mga alerto at rekomendasyon na nakikita mo.",
    methodSection: "PAMAMARAAN",
    sourceSection: "PINAGMULAN",
    thresholdsSection: "MGA HANGGANAN NG YUGTO",
    methodBody:
      "Apat na multivariate linear regression na sinanay sa mismong device, isa sa bawat saklaw ng pagtataya (1, 3, 6, 12 buwan). Mga features: kasalukuyang niyebe at ulan (% ng normal), niyebe at ulan na may 3 buwang lag, at sin/cos seasonality ng buwan.",
    horizonLabel: (m) => `+${m} buwan`,
    dataset: "Dataset",
    datasetValue: "H2O Hackathon Challenge",
    endpoint: "Endpoint",
    coverage: "Saklaw",
    records: "Mga tala",
    recordsValue: (n) => `${n} buwan`,
    region: "Rehiyon",
    regionValue: "San Joaquin County, CA",
    thresholdRange: {
      Normal: "> 85% ng reserba",
      Watch: "75 – 85%",
      Warning: "65 – 75%",
      Emergency: "< 65%",
    },
    disclaimer:
      "Prototype lang sa hackathon. Huwag magbase ng pasya sa patubig dito.",
  },

  toast: {
    brand: "DROUGHTCAST",
    nowAdv: "ngayon",
    forecastSummary: ({ stage, pct, month }) =>
      `Tayang ${stage} — ${Math.round(pct)}% pagsapit ng ${month}`,
  },
};

export default tl;
