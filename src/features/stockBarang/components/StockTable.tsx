import { Table } from "@/components/ui/Table";

export function StockTable({ data }: { data: any[] }) {
  return <Table><tbody>{data.map((x) => <tr key={`${x.id}-${x.plant}`}><td>{x.name}</td><td>{x.freeStock}</td><td>{x.blockedStock}</td><td>{x.rop}</td></tr>)}</tbody></Table>;
}
