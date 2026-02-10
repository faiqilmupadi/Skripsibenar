export function mapAccountRow(row: any) {
  return {
    id: Number(row.id),
    name: row.name || row.username,
    username: row.username,
    email: row.email,
    role: row.role,
    status: row.status || "ACTIVE"
  };
}

export const accountStatusText = (x: string) => (x === "ACTIVE" ? "Aktif" : "Nonaktif");
