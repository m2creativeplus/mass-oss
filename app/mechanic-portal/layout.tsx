import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mechanic Portal - MASS',
  description: 'Mobile portal for technicians and mechanics',
};

export default function MechanicPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 flex flex-col font-sans">
      <header className="bg-slate-950 border-b border-slate-800 p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-gradient-to-r from-orange-500 to-amber-500 flex items-center justify-center font-bold text-white shadow-md">
            M
          </div>
          <h1 className="text-lg font-bold tracking-tight text-white uppercase">Mechanic Portal</h1>
        </div>
        <div className="text-xs text-orange-400 font-medium">
          Logged In
        </div>
      </header>
      <main className="flex-1 overflow-y-auto w-full max-w-md mx-auto relative pb-20">
        {children}
      </main>
    </div>
  );
}
