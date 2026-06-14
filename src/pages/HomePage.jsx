import { BookOpen, Brain, Mic, ChevronRight, Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TOTAL_LESSONS } from '../data/vocabulary';

const FEATURE_CARDS = [
  {
    page: 'vocabulary',
    icon: BookOpen,
    color: 'from-indigo-500 to-purple-600',
    title: 'Denní slovíčka',
    desc: '3 nová slova s mnemonikou',
  },
  {
    page: 'quiz',
    icon: Brain,
    color: 'from-emerald-500 to-teal-600',
    title: 'Kvíz',
    desc: 'Otestuj slovní zásobu oběma směry',
  },
  {
    page: 'speaking',
    icon: Mic,
    color: 'from-rose-500 to-pink-600',
    title: 'Mluvení',
    desc: 'Popisuj situace a dostávej zpětnou vazbu',
  },
];

export default function HomePage() {
  const { state, setActivePage } = useApp();
  const { streak, xp, completedLessons, currentLesson } = state;
  const progress = Math.round((completedLessons.length / TOTAL_LESSONS) * 100);

  return (
    <div className="space-y-6">
      {/* Hero greeting */}
      <div className="text-center space-y-1 pt-2">
        <h1 className="text-3xl font-bold text-white">Dobrý den! 👋</h1>
        <p className="text-slate-400 text-sm">Pokračuj ve své cestě za angličtinou</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-800 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-orange-400 mb-1">
            <Flame size={18} />
            <span className="text-xl font-bold text-white">{streak}</span>
          </div>
          <p className="text-[11px] text-slate-400">Denní série</p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold text-white mb-1">⚡ {xp}</div>
          <p className="text-[11px] text-slate-400">Celkem XP</p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-3 text-center">
          <div className="text-xl font-bold text-white mb-1">{completedLessons.length}/{TOTAL_LESSONS}</div>
          <p className="text-[11px] text-slate-400">Lekce</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Celkový pokrok</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Current lesson CTA */}
      {currentLesson <= TOTAL_LESSONS && (
        <button
          onClick={() => setActivePage('vocabulary')}
          className="w-full flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-4 text-white shadow-lg shadow-indigo-900/40 hover:opacity-90 transition-opacity"
        >
          <div className="text-left">
            <p className="text-xs text-indigo-200 uppercase tracking-wider font-medium">Dnešní lekce</p>
            <p className="text-lg font-bold">Lekce {currentLesson}</p>
            <p className="text-sm text-indigo-200">3 nová slovíčka čekají</p>
          </div>
          <ChevronRight size={24} className="text-indigo-200 shrink-0" />
        </button>
      )}

      {/* Feature cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Co chceš dělat?</h2>
        {FEATURE_CARDS.map(({ page, icon: Icon, color, title, desc }) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className="w-full flex items-center gap-4 bg-slate-800 hover:bg-slate-700 rounded-2xl p-4 transition-colors text-left"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0`}>
              <Icon size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-white">{title}</p>
              <p className="text-sm text-slate-400">{desc}</p>
            </div>
            <ChevronRight size={18} className="text-slate-500" />
          </button>
        ))}
      </div>
    </div>
  );
}
