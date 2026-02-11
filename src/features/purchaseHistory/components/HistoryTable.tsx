import { Table } from "@/components/ui/Table";

export function HistoryTable({ data }: { data: any[] }) {
  return (
    <Table>
      <tbody>
        {data.map((x) => (
          <tr key={x.movementId}>
            <td>{x.postingDate?.slice(0, 10)}</td>
            <td>{x.userName}</td>
            <td>{x.partNumber}</td>
            <td>{x.movementType}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
