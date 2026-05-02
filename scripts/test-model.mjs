// Sanity check: fetch + train + report R² for each horizon.
import MLR from "ml-regression-multivariate-linear";

const HORIZONS = [1, 3, 6, 12];
const LAG = 3;

function feat(s, p, sl, pl, m) {
  const r = ((m - 1) / 12) * 2 * Math.PI;
  return [s, p, sl, pl, Math.sin(r), Math.cos(r)];
}

function r2(actual, predicted) {
  const mean = actual.reduce((a, b) => a + b, 0) / actual.length;
  let res = 0,
    tot = 0;
  for (let i = 0; i < actual.length; i++) {
    res += (actual[i] - predicted[i]) ** 2;
    tot += (actual[i] - mean) ** 2;
  }
  return 1 - res / tot;
}

const raw = await fetch("https://scoringapi.h2ohackathon.org/Challenge/json").then((r) => r.json());
const rows = raw
  .map((r) => {
    const [m, d, yy] = r.Date.split("/").map((x) => +x);
    return {
      date: new Date(2000 + yy, m - 1, d),
      month: m,
      snowpack: +r.Snowpack,
      precip: +r.Precip,
      reservoir: +r.Reservoir,
    };
  })
  .sort((a, b) => a.date - b.date);

console.log(`Loaded ${rows.length} rows.`);
for (const h of HORIZONS) {
  const X = [],
    Y = [];
  for (let t = LAG; t < rows.length - h; t++) {
    const c = rows[t];
    const l = rows[t - LAG];
    X.push(feat(c.snowpack, c.precip, l.snowpack, l.precip, c.month));
    Y.push([rows[t + h].reservoir]);
  }
  const mlr = new MLR(X, Y);
  const pred = X.map((x) => mlr.predict(x)[0]);
  const actual = Y.map((y) => y[0]);
  console.log(`horizon ${h}m: R²=${r2(actual, pred).toFixed(3)} n=${X.length}`);
}
