"use client";
import { Button } from "@/components/ui/Button";
import { useHistoryExport } from "@/features/purchaseHistory/hooks/useHistoryExport";
export function ExportButton() { const { exportXlsx } = useHistoryExport(); return <Button onClick={exportXlsx}>Export Excel</Button>; }
