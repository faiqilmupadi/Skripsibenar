import { Table } from "@/components/ui/Table";

export function AccountTable({ data }: { data: any[] }) {
  return <Table><tbody>{data.map((x) => <tr key={x.id}><td>{x.name}</td><td>{x.username}</td><td>{x.status}</td></tr>)}</tbody></Table>;
}
