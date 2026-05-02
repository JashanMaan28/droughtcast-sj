import MLR from "ml-regression-multivariate-linear";
import type { Horizon, Row } from "./types";

export const HORIZONS: Horizon[] = [1, 3, 6, 12];
const LAG = 3;

export type FeatureVec = [number, number, number, number, number, number];

export function buildFeatures(
  snowpack: number,
  precip: number,
  snowpackLag: number,
  precipLag: number,
  month: number, // 1-12
): FeatureVec {
  const radians = ((month - 1) / 12) * 2 * Math.PI;
  return [
    snowpack,
    precip,
    snowpackLag,
    precipLag,
    Math.sin(radians),
    Math.cos(radians),
  ];
}

type TrainedModel = {
  predict: (x: FeatureVec) => number;
  r2: number;
};

export type ModelBundle = Record<Horizon, TrainedModel>;

function r2Score(actual: number[], predicted: number[]): number {
  const mean = actual.reduce((s, v) => s + v, 0) / actual.length;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < actual.length; i++) {
    ssRes += (actual[i] - predicted[i]) ** 2;
    ssTot += (actual[i] - mean) ** 2;
  }
  return ssTot === 0 ? 0 : 1 - ssRes / ssTot;
}

export function trainModels(rows: Row[]): ModelBundle {
  const bundle: Partial<ModelBundle> = {};
  for (const h of HORIZONS) {
    const X: FeatureVec[] = [];
    const Y: number[][] = [];
    for (let t = LAG; t < rows.length - h; t++) {
      const cur = rows[t];
      const lag = rows[t - LAG];
      X.push(
        buildFeatures(
          cur.snowpack,
          cur.precip,
          lag.snowpack,
          lag.precip,
          cur.month,
        ),
      );
      Y.push([rows[t + h].reservoir]);
    }
    const mlr = new MLR(X, Y);
    const predicted = X.map((x) => mlr.predict(x)[0]);
    const actual = Y.map((y) => y[0]);
    bundle[h] = {
      predict: (x: FeatureVec) => mlr.predict(x)[0],
      r2: r2Score(actual, predicted),
    };
  }
  return bundle as ModelBundle;
}

// Mean snowpack/precip across all history rows whose month matches `month` (1-12).
// Falls back to the overall mean if no row matches.
function meanForMonth(
  rows: Row[],
  month: number,
): { snowpack: number; precip: number } {
  let s = 0;
  let p = 0;
  let n = 0;
  for (const r of rows) {
    if (r.month === month) {
      s += r.snowpack;
      p += r.precip;
      n++;
    }
  }
  if (n === 0) {
    for (const r of rows) {
      s += r.snowpack;
      p += r.precip;
    }
    n = rows.length || 1;
  }
  return { snowpack: s / n, precip: p / n };
}

// Predict reservoir level n months out, given current conditions.
// Lag features use the historical month-of-year mean for `startMonth - LAG`,
// so they stay seasonally aligned with the scenario regardless of where the
// most recent real row falls in the calendar.
export function predictHorizon(
  models: ModelBundle,
  rows: Row[],
  snowpack: number,
  precip: number,
  startMonth: number, // 1-12
  horizon: Horizon,
): number {
  const lagMonth = ((startMonth - 1 - LAG + 12) % 12) + 1;
  const lag = meanForMonth(rows, lagMonth);
  const x = buildFeatures(
    snowpack,
    precip,
    lag.snowpack,
    lag.precip,
    startMonth,
  );
  return models[horizon].predict(x);
}

// Build a 12-month forecast curve (one entry per future month).
// Each step uses the user's `snowpack`/`precip` as the current driver,
// month-of-year advances, lag values come from real history.
export function forecastCurve(
  models: ModelBundle,
  rows: Row[],
  snowpack: number,
  precip: number,
  startMonth: number,
): number[] {
  const out: number[] = [];
  // We have 4 trained horizons (1,3,6,12). Linearly interpolate intermediate months.
  const known: Record<number, number> = { 0: rows[rows.length - 1].reservoir };
  for (const h of HORIZONS) {
    known[h] = predictHorizon(
      models,
      rows,
      snowpack,
      precip,
      startMonth,
      h,
    );
  }
  const anchors = [0, 1, 3, 6, 12];
  for (let m = 1; m <= 12; m++) {
    let lo = 0;
    let hi = 12;
    for (let i = 0; i < anchors.length - 1; i++) {
      if (m >= anchors[i] && m <= anchors[i + 1]) {
        lo = anchors[i];
        hi = anchors[i + 1];
        break;
      }
    }
    const t = (m - lo) / (hi - lo);
    out.push(known[lo] + t * (known[hi] - known[lo]));
  }
  return out;
}
