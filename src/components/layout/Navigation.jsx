import { BookOpen, Brain, Mic, Home, Flame, LogOut, LayoutGrid, BarChart2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NAV_ITEMS = [
  { id: 'home',       label: 'Domů',     icon: Home },
  { id: 'vocabulary', label: 'Slovíčka', icon: BookOpen },
  { id: 'flashcards', label: 'Kartičky', icon: LayoutGrid },
  { id: 'quiz',       label: 'Kvíz',     icon: Brain },
  { id: 'speaking',   label: 'Mluvení',  icon: Mic },
  { id: 'stats',      label: 'Statistiky', icon: BarChart2 },
];

export default function Navigation() {
  const { state, setActivePage, signOut, syncing } = useApp();
  const { activePage, streak, xp } = state;

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" className="rounded-sm shrink-0">
            <rect width="60" height="40" fill="#012169"/>
            <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8"/>
            <path d="M0,0 L60,40 M60,0 L0,40" stroke="#C8102E" strokeWidth="4.8"/>
            <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="13.3"/>
            <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="8"/>
          </svg>
          <span className="font-bold text-white text-lg tracking-tight">EnglishUp</span>
          {syncing && <span className="text-[10px] text-slate-500 ml-1">ukládám…</span>}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-full">
            <Flame size={16} className="text-orange-400" />
            <span className="text-sm font-semibold text-orange-300">{streak}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-full">
            <span className="text-sm font-semibold text-indigo-300">⚡ {xp} XP</span>
          </div>
          <button
            onClick={signOut}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
            title="Odhlásit se"
          >
            <LogOut size={15} className="text-slate-400" />
          </button>
        </div>
      </header>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-slate-800 bg-slate-900/95 backdrop-blur">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => setActivePage(id)}
              className={`flex flex-col items-center justify-center flex-1 py-2 gap-0.5 transition-colors
                ${isActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
