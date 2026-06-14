import { useState, useMemo, useCallback } from 'react';
import { RotateCcw, Lightbulb, CheckCircle2, HelpCircle, XCircle, Trophy, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { vocabulary } from '../data/vocabulary';

// ─── Spaced-repetition weights ────────────────────────────────────────────────
const WEIGHTS = { unknown: 10, unsure: 5, known: 1 };

function pickWeightedRandom(words, mastery) {
  const weighted = [];
  for (const word of words) {
    const level = mastery[word.id] ?? 'unknown';
    const w = WEIGHTS[level];
    for (let i = 0; i < w; i++) weighted.push(word);
  }
  return weighted[Math.floor(Math.random() * weighted.length)];
}

// ─── Flip Card ────────────────────────────────────────────────────────────────
function FlipCard({ word, mastery }) {
  const [flipped, setFlipped] = useState(false);
  const level = mastery[word.id] ?? 'unknown';

  const levelBadge = {
    known:   { label: 'Umím',           color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    unsure:  { label: 'Nejsem si jistý', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    unknown: { label: 'Neumím',          color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  }[level];

  return (
    <div
      className="w-full cursor-pointer"
      style={{ perspective: '1200px' }}
      onClick={() => setFlipped((f) => !f)}
    >
      <div
        style={{
          transition: 'transform 0.55s cubic-bezier(0.4,0,0.2,1)',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          position: 'relative',
          minHeight: '280px',
        }}
      >
        {/* ── Front: Czech ── */}
        <div
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex flex-col items-center justify-center p-8 gap-4 shadow-2xl"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Česky</span>
          <p className="text-3xl font-bold text-white text-center leading-tight">{word.czech}</p>
          <div className={`mt-2 px-3 py-1 rounded-full border text-xs font-semibold ${levelBadge.color}`}>
            {levelBadge.label}
          </div>
          <p className="text-slate-600 text-xs mt-2 flex items-center gap-1">
            <RotateCcw size={12} /> Klikni pro otočení
          </p>
        </div>

        {/* ── Back: English + mnemonic ── */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-indigo-700/40 flex flex-col items-center justify-center p-8 gap-4 shadow-2xl"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">English</span>
          <p className="text-3xl font-bold text-white text-center leading-tight">{word.english}</p>
          {word.phonetic && (
            <p className="text-slate-400 text-sm font-mono">{word.phonetic}</p>
          )}
          {word.difficulty && (
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-semibold">
              {word.difficulty}
            </span>
          )}

          {/* Mnemonic */}
          <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mt-1">
            <div className="flex items-center gap-1.5 mb-2">
              <Lightbulb size={14} className="text-amber-400 shrink-0" />
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Mnemotechnika</span>
            </div>
            <p className="text-sm text-amber-100/80 leading-relaxed">{word.mnemonic}</p>
          </div>

          {/* Example */}
          <p className="text-slate-400 text-xs text-center italic">"{word.exampleSentence}"</p>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state (no unlocked words) ─────────────────────────────────────────
function EmptyState({ onGoLearn }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center">
        <BookOpen size={36} className="text-slate-500" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white mb-2">Zatím žádná slovíčka</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          Nejdřív se nauč slovíčka v lekcích — pak se tu objeví kartičky k procvičení.
        </p>
      </div>
      <button
        onClick={onGoLearn}
        className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
      >
        Jít na lekce →
      </button>
    </div>
  );
}

// ─── Session complete ─────────────────────────────────────────────────────────
function SessionComplete({ stats, onRestart }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-900/40">
        <Trophy size={44} className="text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Skvělá práce!</h2>
        <p className="text-slate-400 text-sm">Dokončil jsi kolo procvičování</p>
      </div>

      <div className="w-full grid grid-cols-3 gap-3">
        {[
          { label: 'Umím',           count: stats.known,   color: 'emerald' },
          { label: 'Nejsem si jistý', count: stats.unsure, color: 'amber' },
          { label: 'Neumím',          count: stats.unknown, color: 'rose' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`bg-${color}-500/10 border border-${color}-500/20 rounded-2xl p-3`}>
            <p className={`text-2xl font-bold text-${color}-400`}>{count}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <button
        onClick={onRestart}
        className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition-colors"
      >
        Procvičit znovu
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FlashcardsPage() {
  const { state, dispatch, setActivePage } = useApp();
  const { unlockedWordIds, flashcardMastery } = state;

  // Only show words user has unlocked via lessons
  const availableWords = useMemo(
    () => vocabulary.filter((w) => unlockedWordIds.includes(w.id)),
    [unlockedWordIds],
  );

  const [currentWord, setCurrentWord] = useState(() =>
    availableWords.length > 0 ? pickWeightedRandom(availableWords, flashcardMastery) : null,
  );
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionStats, setSessionStats] = useState({ known: 0, unsure: 0, unknown: 0 });
  const [done, setDone] = useState(false);

  // After N cards per session, show summary
  const SESSION_LENGTH = Math.max(availableWords.length * 2, 10);

  const handleAnswer = useCallback(
    (level) => {
      if (!currentWord) return;

      dispatch({ type: 'UPDATE_MASTERY', payload: { wordId: currentWord.id, level } });

      const newStats = { ...sessionStats, [level]: sessionStats[level] + 1 };
      const newCount = sessionCount + 1;
      setSessionStats(newStats);
      setSessionCount(newCount);

      if (newCount >= SESSION_LENGTH) {
        setDone(true);
        return;
      }

      // Pick next card with updated mastery (optimistic — state updates are async,
      // so we merge locally for the weight calculation)
      const updatedMastery = { ...flashcardMastery, [currentWord.id]: level };
      setCurrentWord(pickWeightedRandom(availableWords, updatedMastery));
    },
    [currentWord, dispatch, flashcardMastery, availableWords, sessionCount, sessionStats, SESSION_LENGTH],
  );

  const handleRestart = useCallback(() => {
    setSessionCount(0);
    setSessionStats({ known: 0, unsure: 0, unknown: 0 });
    setDone(false);
    setCurrentWord(pickWeightedRandom(availableWords, flashcardMastery));
  }, [availableWords, flashcardMastery]);

  // ── Computed mastery summary ──────────────────────────────────────────────
  const masteryBreakdown = useMemo(() => {
    const counts = { known: 0, unsure: 0, unknown: 0 };
    for (const w of availableWords) {
      const level = flashcardMastery[w.id] ?? 'unknown';
      counts[level]++;
    }
    return counts;
  }, [availableWords, flashcardMastery]);

  if (availableWords.length === 0) {
    return <EmptyState onGoLearn={() => setActivePage('vocabulary')} />;
  }

  if (done) {
    return <SessionComplete stats={sessionStats} onRestart={handleRestart} />;
  }

  const progress = Math.round((sessionCount / SESSION_LENGTH) * 100);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Kartičky</h1>
        <p className="text-slate-400 text-sm mt-0.5">{availableWords.length} slovíček • otoč a ohodnoť</p>
      </div>

      {/* Mastery bar summary */}
      <div className="bg-slate-800/60 rounded-2xl p-4 space-y-2">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Celkový přehled</span>
          <span>{availableWords.length} slov</span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
          {(['known', 'unsure', 'unknown'] ).map((lvl) => {
            const pct = availableWords.length > 0
              ? (masteryBreakdown[lvl] / availableWords.length) * 100
              : 0;
            const colors = { known: 'bg-emerald-500', unsure: 'bg-amber-400', unknown: 'bg-rose-500' };
            return pct > 0 ? (
              <div key={lvl} className={`${colors[lvl]} transition-all duration-500`} style={{ width: `${pct}%` }} />
            ) : null;
          })}
        </div>
        <div className="flex gap-4 text-xs">
          <span className="text-emerald-400">✓ Umím: {masteryBreakdown.known}</span>
          <span className="text-amber-400">~ Nejsem si jistý: {masteryBreakdown.unsure}</span>
          <span className="text-rose-400">✗ Neumím: {masteryBreakdown.unknown}</span>
        </div>
      </div>

      {/* Session progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>Kolo: {sessionCount} / {SESSION_LENGTH}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flip card */}
      {currentWord && (
        <FlipCard key={currentWord.id + sessionCount} word={currentWord} mastery={flashcardMastery} />
      )}

      {/* Answer buttons */}
      <div className="grid grid-cols-3 gap-3 pt-1">
        <button
          onClick={() => handleAnswer('unknown')}
          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
        >
          <XCircle size={24} className="text-rose-400" />
          <span className="text-xs font-semibold text-rose-400">Neumím</span>
        </button>
        <button
          onClick={() => handleAnswer('unsure')}
          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
        >
          <HelpCircle size={24} className="text-amber-400" />
          <span className="text-xs font-semibold text-amber-400">Nejsem si jistý</span>
        </button>
        <button
          onClick={() => handleAnswer('known')}
          className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
        >
          <CheckCircle2 size={24} className="text-emerald-400" />
          <span className="text-xs font-semibold text-emerald-400">Umím</span>
        </button>
      </div>
    </div>
  );
}
