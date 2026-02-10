import { Card } from "@/components/ui/Card";

export function DashboardKpiCards({ value, freeUnits, blockedUnits }: any) {
  return <div className="grid grid-cols-3 gap-3"><Card>Nilai Aset: {value || 0}</Card><Card>Free: {freeUnits || 0}</Card><Card>Blocked: {blockedUnits || 0}</Card></div>;
}
