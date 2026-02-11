export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Warehouse Monitoring</p>
          <h1 className="text-lg font-semibold text-slate-800">Sistem Tampilan Pergudangan</h1>
        </div>
      </div>
    </header>
  );
}
