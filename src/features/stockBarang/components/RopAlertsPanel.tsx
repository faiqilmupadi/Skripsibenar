export function RopAlertsPanel({ data }: { data: any[] }) {
  const alerts = data.filter((x) => x.free_stock <= x.rop);
  return <div className="rounded bg-white p-3 shadow">Notifikasi ROP: {alerts.length} item</div>;
}
