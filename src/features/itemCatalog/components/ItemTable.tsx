import { Table } from "@/components/ui/Table";

export function ItemTable({ data }: { data: any[] }) {
  return (
    <Table>
      <tbody>
        {data.map((x) => (
          <tr key={`${x.partNumber}-${x.plant}`}>
            <td>{x.partNumber}</td>
            <td>{x.materialDescription}</td>
            <td>{x.freeStock}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
