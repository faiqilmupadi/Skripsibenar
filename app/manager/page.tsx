'use client';

import { useEffect, useState } from 'react';
import { Topbar } from '@/components/Topbar';
import toast from 'react-hot-toast';

export default function ManagerPage() {
  const [summary, setSummary] = useState<any>(null);
  const [fsn, setFsn] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);

  const load = async () => {
    const [s, f, u, i, m] = await Promise.all([
      fetch('/api/dashboard/summary').then((r) => r.json()),
      fetch('/api/dashboard/fsn?windowDays=30').then((r) => r.json()),
      fetch('/api/users').then((r) => r.json()),
      fetch('/api/items').then((r) => r.json()),
      fetch('/api/movements').then((r) => r.json())
    ]);
    setSummary(s.data);
    setFsn(f.data ?? []);
    setUsers(u.data ?? []);
    setItems(i.data ?? []);
    setMovements(m.data ?? []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="p-6">
      <Topbar title="Kepala Gudang Dashboard" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><p className="text-sm text-slate-500">Nilai Asset</p><p className="text-2xl font-semibold text-primary">Rp {Number(summary?.assetValue ?? 0).toLocaleString('id-ID')}</p></div>
        <div className="card md:col-span-2"><p className="mb-2 font-semibold">Performa Admin (jumlah movement)</p>{summary?.movements?.map((m:any)=><div key={m.userId}>User #{m.userId}: {m._count._all}</div>)}</div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="card">
          <h3 className="mb-2 font-semibold">FSN Top Fast Moving</h3>
          {fsn.filter((x)=>x.fsn==='FAST').slice(0,10).map((x)=> <div key={x.itemId}>{x.itemName} - {x.qty}</div>)}
        </div>
        <div className="card">
          <h3 className="mb-2 font-semibold">Export</h3>
          <a className="btn-primary inline-block" href="/api/export/movements.xlsx">Download Excel</a>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <CrudUser users={users} onDone={load} />
        <CrudItem items={items} onDone={load} />
      </div>

      <div className="card mt-4">
        <h3 className="mb-2 font-semibold">History Movement</h3>
        <div className="max-h-80 overflow-auto text-sm">
          <table className="w-full">
            <thead><tr><th className="text-left">Tanggal</th><th className="text-left">Item</th><th>Tipe</th><th>User</th></tr></thead>
            <tbody>{movements.map((m)=><tr key={m.id} className="border-t"><td>{new Date(m.createdAt).toLocaleString('id-ID')}</td><td>{m.item.name}</td><td>{m.type}</td><td>{m.user.name}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

function CrudUser({ users, onDone }: { users: any[]; onDone: () => void }) {
  const [form, setForm] = useState({ name: '', username: '', password: '', role: 'ADMIN_GUDANG' });
  return <div className="card space-y-2"><h3 className="font-semibold">Kelola Akun</h3>
    {users.map((u)=><div key={u.id} className="flex justify-between"><span>{u.name} ({u.role})</span><button className="text-xs text-blue-700" onClick={async()=>{await fetch(`/api/users/${u.id}/status`,{method:'PATCH',body:JSON.stringify({status:u.status==='ACTIVE'?'INACTIVE':'ACTIVE'})});onDone();}}>Toggle</button></div>)}
    <input className="input" placeholder="Nama" onChange={(e)=>setForm({...form,name:e.target.value})} />
    <input className="input" placeholder="Username" onChange={(e)=>setForm({...form,username:e.target.value})} />
    <input className="input" placeholder="Password" type="password" onChange={(e)=>setForm({...form,password:e.target.value})} />
    <select className="input" onChange={(e)=>setForm({...form,role:e.target.value})}><option value="ADMIN_GUDANG">Admin</option><option value="KEPALA_GUDANG">Kepala</option></select>
    <button className="btn-primary" onClick={async()=>{const res=await fetch('/api/users',{method:'POST',body:JSON.stringify(form)}); if(!res.ok) return toast.error('Gagal'); toast.success('User ditambah'); onDone();}}>Tambah User</button></div>;
}

function CrudItem({ items, onDone }: { items: any[]; onDone: () => void }) {
  const [form, setForm] = useState({ code: '', name: '', unit: '', price: 0, rop: 0 });
  return <div className="card space-y-2"><h3 className="font-semibold">Kelola Item</h3>
  {items.map((i)=><div key={i.id} className="flex justify-between"><span>{i.name} (ROP {i.rop})</span><button className="text-xs text-blue-700" onClick={async()=>{await fetch(`/api/items/${i.id}/active`,{method:'PATCH',body:JSON.stringify({isActive:!i.isActive})});onDone();}}>Toggle</button></div>)}
  <input className="input" placeholder="Kode" onChange={(e)=>setForm({...form,code:e.target.value})} />
  <input className="input" placeholder="Nama" onChange={(e)=>setForm({...form,name:e.target.value})} />
  <input className="input" placeholder="Unit" onChange={(e)=>setForm({...form,unit:e.target.value})} />
  <input className="input" placeholder="Harga" type="number" onChange={(e)=>setForm({...form,price:Number(e.target.value)})} />
  <input className="input" placeholder="ROP" type="number" onChange={(e)=>setForm({...form,rop:Number(e.target.value)})} />
  <button className="btn-primary" onClick={async()=>{const res=await fetch('/api/items',{method:'POST',body:JSON.stringify(form)});if(!res.ok) return toast.error('Gagal');toast.success('Item ditambah');onDone();}}>Tambah Item</button>
  </div>;
}
