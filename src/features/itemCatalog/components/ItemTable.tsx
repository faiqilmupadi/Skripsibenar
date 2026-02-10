import { Table } from "@/components/ui/Table";

export function ItemTable({ data }: { data: any[] }) {
  return <Table><tbody>{data.map((x) => <tr key={`${x.id}-${x.plant}`}><td>{x.code}</td><td>{x.name}</td><td>{x.freeStock}</td></tr>)}</tbody></Table>;
}
