import { Table } from "@/components/ui/Table";

export function StockTable({ data }: { data: any[] }) {
  return (
    <Table>
      <tbody>
        {data.map((x) => (
          <tr key={`${x.id}-${x.plant}`}>
            <td>{x.name}</td><td>{x.freeStockLabel}</td><td>{x.blockedStockLabel}</td><td>{x.ropLabel}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
