import { useMemo } from 'react';
import { Flame, Zap, BookOpen, CheckCircle2, Mic, BarChart2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TOTAL_LESSONS } from '../data/vocabulary';
import { exercises } from '../data/exercises';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildHeatmap(activityLog, days = 28) {
  const set = new Set(activityLog ?? []);
  const cells = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const str = d.toISOString().split('T')[0];
    cells.push({ date: str, active: set.has(str) });
  }
  return cells;
}

const DAY_LABELS = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryCards({ streak, xp, completedLessons }) {
  const progress = Math.round((completedLessons.length / TOTAL_LESSONS) * 100);
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={18} className="text-orange-400" />
            <span className="text-xs text-slate-400 font-medium">Denní série</span>
          </div>
          <p className="text-3xl font-bold text-white">{streak}</p>
          <p className="text-xs text-slate-500 mt-0.5">dní v řadě</p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap size={18} className="text-indigo-400" />
            <span className="text-xs text-slate-400 font-medium">Celkem XP</span>
          </div>
          <p className="text-3xl font-bold text-white">{xp.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5">bodů</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-emerald-400" />
            <span className="text-xs text-slate-400 font-medium">Celkový pokrok</span>
          </div>
          <span className="text-sm font-semibold text-slate-200">
            {completedLessons.length} / {TOTAL_LESSONS} lekcí
          </span>
        </div>
        <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 mt-2 text-right">{progress}% splněno</p>
      </div>
    </div>
  );
}

function MasteryBar({ flashcardMastery, unlockedWordIds }) {
  const total = unlockedWordIds.length;
  if (total === 0) {
    return (
      <p className="text-sm text-slate-500 text-center py-4">
        Zatím žádná odemčená slovíčka.
      </p>
    );
  }

  const known = unlockedWordIds.filter((id) => flashcardMastery[id] === 'known').length;
  const unsure = unlockedWordIds.filter((id) => flashcardMastery[id] === 'unsure').length;
  const unknown = total - known - unsure;

  const pct = (n) => Math.round((n / total) * 100);

  return (
    <div className="bg-slate-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">Odemčená slovíčka</span>
        <span className="text-xs text-slate-400">{total} celkem</span>
      </div>
      <div className="flex h-3 rounded-full overflow-hidden gap-0.5">
        {known > 0 && (
          <div className="bg-emerald-500 rounded-l-full" style={{ flex: known }} />
        )}
        {unsure > 0 && (
          <div className="bg-amber-400" style={{ flex: unsure }} />
        )}
        {unknown > 0 && (
          <div className="bg-slate-600 rounded-r-full" style={{ flex: unknown }} />
        )}
      </div>
      <div className="flex gap-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-xs text-slate-300">Zvládnuto {pct(known)}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
          <span className="text-xs text-slate-300">Nejisté {pct(unsure)}%</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-600 shrink-0" />
          <span className="text-xs text-slate-300">Neznámé {pct(unknown)}%</span>
        </div>
      </div>
    </div>
  );
}

function QuizBars({ quizScores, completedLessons }) {
  const scored = completedLessons
    .filter((day) => quizScores[day])
    .sort((a, b) => a - b)
    .slice(-8); // last 8 lessons max

  if (scored.length === 0) {
    return (
      <p className="text-sm text-slate-500 text-center py-4">
        Zatím žádné výsledky kvízu.
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {scored.map((day) => {
        const { correct, total } = quizScores[day];
        const pct = Math.round((correct / total) * 100);
        const color =
          pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-indigo-500' : 'bg-rose-500';
        return (
          <div key={day} className="flex items-center gap-3">
            <span className="text-xs text-slate-400 w-14 shrink-0">Lekce {day}</span>
            <div className="flex-1 h-7 bg-slate-800 rounded-xl overflow-hidden">
              <div
                className={`h-full ${color} rounded-xl flex items-center px-3 transition-all duration-500`}
                style={{ width: `${Math.max(pct, 8)}%` }}
              >
                <span className="text-xs font-semibold text-white/90">
                  {correct}/{total}
                </span>
              </div>
            </div>
            <span className="text-xs text-slate-400 w-8 text-right shrink-0">{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

function SpeakingList({ speakingAttempts }) {
  const attempted = exercises.filter((ex) => speakingAttempts[ex.id]);
  if (attempted.length === 0) {
    return (
      <p className="text-sm text-slate-500 text-center py-4">
        Zatím žádné mluvení.
      </p>
    );
  }

  const scoreColor = (score) =>
    score >= 3 ? 'text-emerald-400 bg-emerald-500/15' :
    score === 2 ? 'text-amber-400 bg-amber-500/15' :
    'text-rose-400 bg-rose-500/15';

  const scoreLabel = (score) =>
    score >= 3 ? 'Šlo to' : score === 2 ? 'Ujde to' : 'Těžké';

  return (
    <div className="space-y-2">
      {attempted.slice(-6).map((ex) => {
        const { attempts, lastScore } = speakingAttempts[ex.id];
        return (
          <div
            key={ex.id}
            className="flex items-center gap-3 bg-slate-800 rounded-xl px-4 py-3"
          >
            <Mic size={15} className="text-rose-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-200 truncate">{ex.title}</p>
              <p className="text-xs text-slate-500">
                Lekce {ex.lessonDay} · {attempts}× pokus
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${scoreColor(lastScore)}`}
            >
              {scoreLabel(lastScore)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ActivityHeatmap({ activityLog }) {
  const cells = useMemo(() => buildHeatmap(activityLog, 28), [activityLog]);

  // figure out offset so week starts on Monday
  const firstDate = new Date(cells[0].date);
  const firstDow = (firstDate.getDay() + 6) % 7; // 0=Mon
  const padded = [...Array(firstDow).fill(null), ...cells];

  return (
    <div className="bg-slate-800 rounded-2xl p-4 space-y-3">
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] text-slate-500">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {padded.map((cell, i) =>
          cell === null ? (
            <div key={`pad-${i}`} className="aspect-square" />
          ) : (
            <div
              key={cell.date}
              title={cell.date}
              className={`aspect-square rounded ${
                cell.active
                  ? 'bg-indigo-500'
                  : 'bg-slate-700'
              }`}
            />
          )
        )}
      </div>
      <div className="flex items-center gap-2 justify-end">
        <div className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
        <span className="text-[10px] text-slate-500">Žádná aktivita</span>
        <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500 ml-2" />
        <span className="text-[10px] text-slate-500">Aktivní den</span>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StatsPage() {
  const { state } = useApp();
  const {
    streak, xp,
    completedLessons, unlockedWordIds,
    quizScores, speakingAttempts,
    flashcardMastery, activityLog,
  } = state;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Statistiky</h1>
        <p className="text-slate-400 text-sm mt-0.5">Tvůj celkový pokrok</p>
      </div>

      <SummaryCards streak={streak} xp={xp} completedLessons={completedLessons} />

      <section>
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Slovní zásoba — zvládnutí
        </h2>
        <MasteryBar flashcardMastery={flashcardMastery} unlockedWordIds={unlockedWordIds} />
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <BarChart2 size={15} className="text-slate-400" />
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Výsledky kvízů
          </h2>
        </div>
        <QuizBars quizScores={quizScores} completedLessons={completedLessons} />
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <Mic size={15} className="text-slate-400" />
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Mluvení
          </h2>
        </div>
        <SpeakingList speakingAttempts={speakingAttempts} />
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 size={15} className="text-slate-400" />
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Aktivita — posledních 28 dní
          </h2>
        </div>
        <ActivityHeatmap activityLog={activityLog} />
      </section>
    </div>
  );
}
