import { Table } from "@/components/ui/Table";

export function HistoryTable({ data }: { data: any[] }) {
  return <Table><tbody>{data.map((x) => <tr key={x.id}><td>{x.createdAt?.slice(0, 10)}</td><td>{x.userName}</td><td>{x.itemName}</td><td>{x.type}</td></tr>)}</tbody></Table>;
}
