import { Table } from "@/components/ui/Table";

export function StockTable({ data }: { data: any[] }) {
  return (
    <Table>
      <tbody>
        {data.map((x) => (
          <tr key={`${x.partNumber}-${x.plant}`}>
            <td>{x.materialDescription}</td>
            <td>{x.freeStock}</td>
            <td>{x.blocked}</td>
            <td>{x.reorderPoint}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
