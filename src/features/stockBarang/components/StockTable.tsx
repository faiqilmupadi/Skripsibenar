import { Table } from "@/components/ui/Table";
export function StockTable({ data }: { data: any[] }) { return <Table><tbody>{data.map((x) => <tr key={x.id}><td>{x.name}</td><td>{x.free_stock}</td><td>{x.blocked_stock}</td><td>{x.rop}</td></tr>)}</tbody></Table>; }
