export async function fetcher<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers || {}) } });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || "Request failed");
  return json.data as T;
}
