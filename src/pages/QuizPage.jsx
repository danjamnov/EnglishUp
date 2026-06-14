import { useState, useMemo, useCallback } from 'react';
import { Brain, CheckCircle2, XCircle, ArrowLeft, Trophy, ChevronRight, Lock, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { vocabulary, getWordsForLesson, TOTAL_LESSONS } from '../data/vocabulary';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Pick N unique random items from an array, excluding a set of IDs. */
function pickRandom(arr, count, excludeIds = []) {
  const pool = arr.filter((w) => !excludeIds.includes(w.id));
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/** Generate 6 questions for a lesson (3 CZ→EN, 3 EN→CZ). */
function buildQuestions(lessonWords) {
  const questions = [];

  lessonWords.forEach((word) => {
    // CZ → EN: show Czech, pick English
    const distractorsEN = pickRandom(vocabulary, 3, [word.id]).map((w) => w.english);
    const optionsEN = [...distractorsEN, word.english].sort(() => Math.random() - 0.5);
    questions.push({
      id: `${word.id}_cz_en`,
      direction: 'cz_en',
      prompt: word.czech,
      promptLabel: 'Česky',
      correct: word.english,
      options: optionsEN,
      wordId: word.id,
    });

    // EN → CZ: show English, pick Czech
    const distractorsCZ = pickRandom(vocabulary, 3, [word.id]).map((w) => w.czech);
    const optionsCZ = [...distractorsCZ, word.czech].sort(() => Math.random() - 0.5);
    questions.push({
      id: `${word.id}_en_cz`,
      direction: 'en_cz',
      prompt: word.english,
      promptLabel: 'English',
      correct: word.czech,
      options: optionsCZ,
      wordId: word.id,
    });
  });

  return questions.sort(() => Math.random() - 0.5);
}

// ─── Lesson Picker ────────────────────────────────────────────────────────────
function LessonPicker({ completedLessons, quizScores, onSelect }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Kvíz</h1>
        <p className="text-slate-400 text-sm mt-1">Otestuj se oběma směry: česky ↔ anglicky</p>
      </div>

      <div className="space-y-3">
        {Array.from({ length: TOTAL_LESSONS }, (_, i) => i + 1).map((day) => {
          const isUnlocked = completedLessons.includes(day);
          const score = quizScores[day];
          const pct = score ? Math.round((score.correct / score.total) * 100) : null;

          return (
            <button
              key={day}
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onSelect(day)}
              className={`w-full flex items-center gap-4 rounded-2xl p-4 transition-all text-left
                ${isUnlocked
                  ? 'bg-slate-800 hover:bg-slate-700'
                  : 'bg-slate-800/40 opacity-50 cursor-not-allowed'
                }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                ${isUnlocked ? (pct !== null ? 'bg-emerald-500/20' : 'bg-indigo-600/30') : 'bg-slate-700'}`}>
                {isUnlocked
                  ? pct !== null
                    ? <CheckCircle2 size={22} className="text-emerald-400" />
                    : <Brain size={22} className="text-indigo-300" />
                  : <Lock size={22} className="text-slate-600" />
                }
              </div>

              <div className="flex-1">
                <p className="font-semibold text-slate-200">Lekce {day} — Kvíz</p>
                <p className="text-sm text-slate-500">
                  {!isUnlocked
                    ? 'Nejdřív dokonči lekci ve Slovíčkách'
                    : pct !== null
                    ? `Skóre: ${score.correct}/${score.total} (${pct}%)`
                    : '6 otázek · CZ ↔ EN'}
                </p>
              </div>

              {isUnlocked && (
                pct !== null
                  ? <RotateCcw size={16} className="text-slate-500 shrink-0" />
                  : <ChevronRight size={18} className="text-slate-500 shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Question Card ────────────────────────────────────────────────────────────
function QuestionCard({ question, onAnswer, qIndex, total }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (option) => {
    if (selected !== null) return;
    setSelected(option);
    setTimeout(() => onAnswer(option === question.correct), 800);
  };

  const getOptionStyle = (option) => {
    if (selected === null) {
      return 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200';
    }
    if (option === question.correct) {
      return 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
    }
    if (option === selected) {
      return 'bg-rose-500/20 border-rose-500 text-rose-300';
    }
    return 'bg-slate-800/50 border-slate-700/50 text-slate-500';
  };

  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500">
          <span>{question.promptLabel}</span>
          <span>{qIndex + 1} / {total}</span>
        </div>
        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${((qIndex) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Prompt */}
      <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-700/30 rounded-3xl p-8 flex flex-col items-center gap-3 min-h-[140px] justify-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
          {question.direction === 'cz_en' ? 'Jak se řekne anglicky?' : 'Jak se přeloží?'}
        </span>
        <p className="text-3xl font-bold text-white text-center leading-tight">{question.prompt}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`w-full py-4 px-5 rounded-2xl border text-left font-medium transition-all duration-200 flex items-center justify-between
              ${getOptionStyle(option)}`}
          >
            <span>{option}</span>
            {selected !== null && option === question.correct && (
              <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            )}
            {selected === option && option !== question.correct && (
              <XCircle size={18} className="text-rose-400 shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Results Screen ───────────────────────────────────────────────────────────
function QuizResults({ correct, total, lessonDay, onBack, onRetry }) {
  const pct = Math.round((correct / total) * 100);
  const emoji = pct === 100 ? '🏆' : pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚';
  const msg =
    pct === 100 ? 'Perfektní! Všechno správně!' :
    pct >= 80 ? 'Skvělá práce! Skoro perfektní.' :
    pct >= 50 ? 'Dobrý základ! Zkus to ještě jednou.' :
    'Nevadí — opakování je základ. Zkus znovu!';

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-900/40">
        <Trophy size={44} className="text-white" />
      </div>
      <div>
        <div className="text-4xl mb-2">{emoji}</div>
        <h2 className="text-3xl font-bold text-white mb-2">{correct} / {total}</h2>
        <p className="text-slate-400">{msg}</p>
        <p className="text-indigo-400 font-semibold mt-1">+{correct * 10} XP</p>
      </div>

      {/* Score ring */}
      <div className="relative w-28 h-28">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="10" />
          <circle
            cx="50" cy="50" r="42" fill="none"
            stroke={pct >= 80 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#f43f5e'}
            strokeWidth="10"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{pct}%</span>
        </div>
      </div>

      <div className="w-full space-y-3">
        <button
          onClick={onRetry}
          className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition-colors"
        >
          Zkusit znovu
        </button>
        <button
          onClick={onBack}
          className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 font-semibold text-slate-200 transition-colors"
        >
          Zpět na lekce
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function QuizPage() {
  const { state, dispatch } = useApp();
  const { completedLessons, quizScores } = state;

  const [lessonDay, setLessonDay] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);

  const startQuiz = useCallback((day) => {
    const words = getWordsForLesson(day);
    setQuestions(buildQuestions(words));
    setLessonDay(day);
    setCurrentQ(0);
    setCorrect(0);
    setDone(false);
  }, []);

  const handleAnswer = useCallback((isCorrect) => {
    const newCorrect = correct + (isCorrect ? 1 : 0);
    const newQ = currentQ + 1;

    if (newQ >= questions.length) {
      setCorrect(newCorrect);
      dispatch({
        type: 'RECORD_QUIZ_SCORE',
        payload: { lessonDay, correct: newCorrect, total: questions.length },
      });
      setDone(true);
    } else {
      setCorrect(newCorrect);
      setCurrentQ(newQ);
    }
  }, [correct, currentQ, questions.length, lessonDay, dispatch]);

  if (!lessonDay) {
    return (
      <LessonPicker
        completedLessons={completedLessons}
        quizScores={quizScores}
        onSelect={startQuiz}
      />
    );
  }

  if (done) {
    return (
      <QuizResults
        correct={correct}
        total={questions.length}
        lessonDay={lessonDay}
        onBack={() => setLessonDay(null)}
        onRetry={() => startQuiz(lessonDay)}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Back button */}
      <button
        onClick={() => setLessonDay(null)}
        className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
      >
        <ArrowLeft size={18} className="text-slate-300" />
      </button>

      <QuestionCard
        key={questions[currentQ]?.id}
        question={questions[currentQ]}
        onAnswer={handleAnswer}
        qIndex={currentQ}
        total={questions.length}
      />
    </div>
  );
}
