'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Topbar } from '@/components/Topbar';

type StockRow = {
  itemId: number;
  freeStock: number;
  blockedStock: number;
  ropAlert: boolean;
  item: { id: number; code: string; name: string; rop: number };
};

export default function AdminPage() {
  const [rows, setRows] = useState<StockRow[]>([]);
  const [q, setQ] = useState('');

  const load = async () => {
    const res = await fetch('/api/stock');
    const json = await res.json();
    if (res.ok) setRows(json.data);
  };
  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => rows.filter((r) => r.item.name.toLowerCase().includes(q.toLowerCase())), [rows, q]);

  return (
    <main className="p-6">
      <Topbar title="Admin Gudang" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card md:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Stok Barang</h2>
            <input className="input w-64" placeholder="Cari item..." onChange={(e) => setQ(e.target.value)} />
          </div>
          <table className="w-full text-sm">
            <thead><tr className="text-left"><th>Item</th><th>Free</th><th>Blocked</th><th>ROP</th></tr></thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.itemId} className="border-t"><td>{r.item.name}</td><td>{r.freeStock}</td><td>{r.blockedStock}</td><td>{r.item.rop}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h2 className="mb-2 font-semibold text-red-600">Peringatan ROP</h2>
          <ul className="space-y-2 text-sm">
            {rows.filter((r) => r.ropAlert).map((r) => <li key={r.itemId}>⚠️ {r.item.name} (free {r.freeStock})</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <ActionCard title="Withdraw Bengkel" onSubmit={async (payload) => {
          await postMovement({ mode: 'OUTBOUND', ...payload });
          toast.success('Withdraw tersimpan');
          load();
        }} />
        <ActionCard title="Return Blocked" returnMode onSubmit={async (payload) => {
          await postMovement({ mode: 'RETURN', itemId: Number(payload.itemId), qty: Number(payload.qty), note: payload.note });
          toast.success('Return tersimpan');
          load();
        }} />
        <OrderCard onDone={load} />
      </div>
    </main>
  );
}

async function postMovement(body: unknown) {
  const res = await fetch('/api/movements', { method: 'POST', body: JSON.stringify(body) });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Gagal');
}

function ActionCard({ title, onSubmit, returnMode = false }: { title: string; returnMode?: boolean; onSubmit: (payload: any) => Promise<void> }) {
  const [itemId, setItemId] = useState('1');
  const [qty, setQty] = useState('1');
  const [customerName, setCustomerName] = useState('');
  const [note, setNote] = useState('');
  return (
    <div className="card space-y-2">
      <h3 className="font-semibold">{title}</h3>
      <input className="input" placeholder="Item ID" value={itemId} onChange={(e) => setItemId(e.target.value)} />
      <input className="input" placeholder="Qty" value={qty} onChange={(e) => setQty(e.target.value)} />
      {!returnMode && <input className="input" placeholder="Customer" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />}
      <input className="input" placeholder="Catatan" value={note} onChange={(e) => setNote(e.target.value)} />
      <button className="btn-primary w-full" onClick={() => onSubmit({ itemId: Number(itemId), qty: Number(qty), customerName, note }).catch((e)=>toast.error(e.message))}>Simpan</button>
    </div>
  );
}

function OrderCard({ onDone }: { onDone: () => void }) {
  const [itemId, setItemId] = useState('1');
  const [qty, setQty] = useState('1');
  const [orderId, setOrderId] = useState('1');
  const [orderItemId, setOrderItemId] = useState('1');
  return (
    <div className="card space-y-2">
      <h3 className="font-semibold">Order & QC</h3>
      <input className="input" placeholder="Item ID" value={itemId} onChange={(e) => setItemId(e.target.value)} />
      <input className="input" placeholder="Qty Order" value={qty} onChange={(e) => setQty(e.target.value)} />
      <button className="btn-primary w-full" onClick={async ()=>{
        const res = await fetch('/api/orders',{method:'POST',body:JSON.stringify({items:[{itemId:Number(itemId),qtyOrdered:Number(qty)}]})});
        const json = await res.json(); if(!res.ok) return toast.error(json.error); toast.success(`Order #${json.data.id} dibuat`); onDone();
      }}>Buat Order</button>
      <input className="input" placeholder="Order ID" value={orderId} onChange={(e) => setOrderId(e.target.value)} />
      <input className="input" placeholder="Order Item ID" value={orderItemId} onChange={(e) => setOrderItemId(e.target.value)} />
      <button className="rounded-lg border px-3 py-2" onClick={async ()=>{
        const res=await fetch(`/api/orders/${orderId}/receive-qc`,{method:'POST',body:JSON.stringify({lines:[{orderItemId:Number(orderItemId),qtyGood:Number(qty),qtyBad:0}]})});
        const json=await res.json(); if(!res.ok) return toast.error(json.error); toast.success('QC sukses'); onDone();
      }}>Terima QC Good</button>
    </div>
  );
}
