import { useState, useMemo, useCallback } from 'react';
import { RotateCcw, Lightbulb, CheckCircle2, HelpCircle, XCircle, Trophy, BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WORD_LISTS, getWordsForList } from '../data/wordLists';

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

// ─── List Picker ──────────────────────────────────────────────────────────────
function ListPicker({ unlockedWordIds, flashcardMastery, onSelect }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Kartičky</h1>
        <p className="text-slate-400 text-sm mt-1">Vyber seznam slovíček k procvičení</p>
      </div>

      <div className="space-y-3">
        {WORD_LISTS.map((list) => {
          const words = getWordsForList(list.id, unlockedWordIds);
          const total = words.length;
          const known = words.filter((w) => flashcardMastery[w.id] === 'known').length;
          const isEmpty = total === 0;

          return (
            <button
              key={list.id}
              disabled={isEmpty}
              onClick={() => !isEmpty && onSelect(list.id)}
              className={`w-full flex items-center gap-4 rounded-2xl p-4 text-left transition-all
                ${isEmpty
                  ? 'bg-slate-800/40 opacity-50 cursor-not-allowed'
                  : 'bg-slate-800 hover:bg-slate-700'
                }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 flex items-center justify-center shrink-0 text-2xl">
                {list.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-200">{list.label}</p>
                <p className="text-sm text-slate-500 truncate">{list.description}</p>
                {!isEmpty && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${total > 0 ? (known / total) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 shrink-0">{known}/{total} umím</span>
                  </div>
                )}
                {isEmpty && list.id === 'lessons' && (
                  <p className="text-xs text-slate-600 mt-1">Nejdřív dokonči lekci ve Slovíčkách</p>
                )}
              </div>
              {!isEmpty && <ChevronRight size={18} className="text-slate-500 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Flip Card ────────────────────────────────────────────────────────────────
function FlipCard({ word, mastery }) {
  const [flipped, setFlipped] = useState(false);
  const level = mastery[word.id] ?? 'unknown';

  const levelBadge = {
    known:   { label: 'Umím',            color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    unsure:  { label: 'Nejsem si jistý', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    unknown: { label: 'Neumím',           color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
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
          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-indigo-700/40 flex flex-col items-center justify-center p-8 gap-3 shadow-2xl"
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

          {/* Mnemonic — only if available */}
          {word.mnemonic && (
            <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mt-1">
              <div className="flex items-center gap-1.5 mb-2">
                <Lightbulb size={14} className="text-amber-400 shrink-0" />
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Mnemotechnika</span>
              </div>
              <p className="text-sm text-amber-100/80 leading-relaxed">{word.mnemonic}</p>
            </div>
          )}

          {/* Example sentence */}
          {word.exampleSentence && (
            <p className="text-slate-400 text-xs text-center italic">"{word.exampleSentence}"</p>
          )}
          {word.exampleTranslation && (
            <p className="text-slate-600 text-xs text-center italic">„{word.exampleTranslation}"</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
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
function SessionComplete({ stats, onRestart, onBack }) {
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
          { label: 'Umím',            count: stats.known,   color: 'emerald' },
          { label: 'Nejsem si jistý', count: stats.unsure,  color: 'amber' },
          { label: 'Neumím',          count: stats.unknown, color: 'rose' },
        ].map(({ label, count, color }) => (
          <div key={label} className={`bg-${color}-500/10 border border-${color}-500/20 rounded-2xl p-3`}>
            <p className={`text-2xl font-bold text-${color}-400`}>{count}</p>
            <p className="text-xs text-slate-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="w-full space-y-3">
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition-colors"
        >
          Procvičit znovu
        </button>
        <button
          onClick={onBack}
          className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 font-semibold text-slate-200 transition-colors"
        >
          Zpět na výběr seznamu
        </button>
      </div>
    </div>
  );
}

// ─── Practice Session ─────────────────────────────────────────────────────────
function PracticeSession({ words, flashcardMastery, dispatch, onBack }) {
  const SESSION_LENGTH = Math.max(Math.min(words.length * 2, 30), 10);

  const [currentWord, setCurrentWord] = useState(() =>
    pickWeightedRandom(words, flashcardMastery),
  );
  const [sessionCount, setSessionCount] = useState(0);
  const [sessionStats, setSessionStats] = useState({ known: 0, unsure: 0, unknown: 0 });
  const [done, setDone] = useState(false);

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

      const updatedMastery = { ...flashcardMastery, [currentWord.id]: level };
      setCurrentWord(pickWeightedRandom(words, updatedMastery));
    },
    [currentWord, dispatch, flashcardMastery, words, sessionCount, sessionStats, SESSION_LENGTH],
  );

  const handleRestart = useCallback(() => {
    setSessionCount(0);
    setSessionStats({ known: 0, unsure: 0, unknown: 0 });
    setDone(false);
    setCurrentWord(pickWeightedRandom(words, flashcardMastery));
  }, [words, flashcardMastery]);

  const masteryBreakdown = useMemo(() => {
    const counts = { known: 0, unsure: 0, unknown: 0 };
    for (const w of words) {
      const level = flashcardMastery[w.id] ?? 'unknown';
      counts[level]++;
    }
    return counts;
  }, [words, flashcardMastery]);

  if (done) {
    return <SessionComplete stats={sessionStats} onRestart={handleRestart} onBack={onBack} />;
  }

  const progress = Math.round((sessionCount / SESSION_LENGTH) * 100);

  return (
    <div className="space-y-5">
      {/* Back */}
      <button
        onClick={onBack}
        className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
      >
        <ArrowLeft size={18} className="text-slate-300" />
      </button>

      {/* Mastery summary bar */}
      <div className="bg-slate-800/60 rounded-2xl p-4 space-y-2">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Celkový přehled</span>
          <span>{words.length} slov</span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
          {['known', 'unsure', 'unknown'].map((lvl) => {
            const pct = words.length > 0 ? (masteryBreakdown[lvl] / words.length) * 100 : 0;
            const colors = { known: 'bg-emerald-500', unsure: 'bg-amber-400', unknown: 'bg-rose-500' };
            return pct > 0 ? (
              <div key={lvl} className={`${colors[lvl]} transition-all duration-500`} style={{ width: `${pct}%` }} />
            ) : null;
          })}
        </div>
        <div className="flex gap-4 text-xs">
          <span className="text-emerald-400">✓ {masteryBreakdown.known}</span>
          <span className="text-amber-400">~ {masteryBreakdown.unsure}</span>
          <span className="text-rose-400">✗ {masteryBreakdown.unknown}</span>
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

      {/* Card */}
      {currentWord && (
        <FlipCard key={currentWord.id + sessionCount} word={currentWord} mastery={flashcardMastery} />
      )}

      {/* Buttons */}
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

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FlashcardsPage() {
  const { state, dispatch, setActivePage } = useApp();
  const { unlockedWordIds, flashcardMastery } = state;

  const [selectedListId, setSelectedListId] = useState(null);

  const activeWords = useMemo(
    () => selectedListId ? getWordsForList(selectedListId, unlockedWordIds) : [],
    [selectedListId, unlockedWordIds],
  );

  if (!selectedListId) {
    return (
      <ListPicker
        unlockedWordIds={unlockedWordIds}
        flashcardMastery={flashcardMastery}
        onSelect={setSelectedListId}
      />
    );
  }

  if (activeWords.length === 0) {
    return <EmptyState onGoLearn={() => setActivePage('vocabulary')} />;
  }

  return (
    <PracticeSession
      key={selectedListId}
      words={activeWords}
      flashcardMastery={flashcardMastery}
      dispatch={dispatch}
      onBack={() => setSelectedListId(null)}
    />
  );
}
