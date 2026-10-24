import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const { platforms } = JSON.parse(readFileSync(new URL('./audience-20261024.json', import.meta.url)));
const sum = values => values.reduce((a, b) => a + b, 0);
const mean = values => sum(values) / values.length;
const normalize = row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key, value * 100 / sum(Object.values(row))]));
const meanRows = rows => Object.fromEntries(Object.keys(rows[0]).map(key => [key, mean(rows.map(row => row[key]))]));
const ageKeys = ['18-24', '25-34', '35-44', '45-54', '55+'];
const ageRows = ['youtube', 'instagram', 'tiktok'].map(name => {
  const source = platforms[name].age;
  const row = Object.fromEntries(ageKeys.map(key => [key, key === '55+' ? (source[key] ?? source['55-64'] + source['65+']) : source[key]]));
  return normalize(row);
});
const countries = ['Russia', 'Kazakhstan', 'Ukraine'];
const geoRows = ['youtube', 'instagram', 'tiktok'].map(name => {
  const row = Object.fromEntries(countries.map(key => [key, platforms[name].countries[key]]));
  return {...row, other: 100 - sum(Object.values(row))};
});
const result = {
  age: meanRows(ageRows),
  gender: meanRows(Object.values(platforms).map(p => normalize(p.gender))),
  geography: meanRows(geoRows),
  teens: mean([platforms.youtube.age['13-17'], platforms.instagram.age['13-17']])
};
for (const row of [result.age, result.gender, result.geography]) {
  assert(Object.values(row).every(value => Number.isFinite(value) && value >= 0 && value <= 100));
  assert(Math.abs(sum(Object.values(row)) - 100) < 1e-8);
}
result.adultCore = result.age['25-34'] + result.age['35-44'];
result.display = {
  age: Object.fromEntries(Object.entries(result.age).map(([key, value]) => [key, Math.round(value)])),
  gender: Object.fromEntries(Object.entries(result.gender).map(([key, value]) => [key, Number(value.toFixed(1))])),
  geography: Object.fromEntries(Object.entries(result.geography).map(([key, value]) => [key, Math.round(value)])),
  adultCore: Math.round(result.adultCore),
  teens: Math.round(result.teens)
};
for (const row of [result.display.age, result.display.gender, result.display.geography]) assert(Math.abs(sum(Object.values(row)) - 100) < 1e-8);
console.log(JSON.stringify(result, null, 2));
