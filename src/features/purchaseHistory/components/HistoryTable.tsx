import { Table } from "@/components/ui/Table";
export function HistoryTable({ data }: { data: any[] }) { return <Table><tbody>{data.map((x) => <tr key={x.id}><td>{x.created_at?.slice(0,10)}</td><td>{x.user_name}</td><td>{x.item_name}</td><td>{x.type}</td></tr>)}</tbody></Table>; }
