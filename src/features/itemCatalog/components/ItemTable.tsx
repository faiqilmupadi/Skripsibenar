import { Table } from "@/components/ui/Table";
export function ItemTable({ data }: { data: any[] }) { return <Table><tbody>{data.map((x) => <tr key={x.id}><td>{x.code}</td><td>{x.name}</td><td>{x.free_stock}</td></tr>)}</tbody></Table>; }
