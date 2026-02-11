import { Copy, Trash2 } from "lucide-react";
import { Account } from "@/features/accountManagement/types/accounts.types";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID");
}

export function AccountTable({ data }: { data: Account[] }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">id</th>
            <th className="px-4 py-3">Password</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Created At</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((account) => (
            <tr key={account.userId} className="border-t border-slate-200">
              <td className="px-4 py-3 font-medium text-slate-700">{account.username}</td>
              <td className="px-4 py-3">{account.userId}</td>
              <td className="px-4 py-3">******</td>
              <td className="px-4 py-3">{account.role}</td>
              <td className="px-4 py-3">{formatDate(account.createdOn)}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-center gap-2">
                  <button type="button" className="rounded p-1 text-slate-500 hover:bg-red-50 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                  <button type="button" className="rounded p-1 text-slate-500 hover:bg-blue-50 hover:text-blue-500">
                    <Copy size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-400">Belum ada data admin.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
