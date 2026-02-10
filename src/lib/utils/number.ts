export function formatDecimal(value: number | string) {
  const normalized = Number(value || 0);
  if (!Number.isFinite(normalized)) return "0";
  return normalized.toFixed(3).replace(/\.0+$/, "").replace(/(\.\d*[1-9])0+$/, "$1");
}
