import { useState } from 'react';
import { BookOpen, Lock, CheckCircle2, ChevronRight, Trophy, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getWordsForLesson, TOTAL_LESSONS } from '../data/vocabulary';
import WordCard from '../components/vocabulary/WordCard';

// ─── Lesson Picker ────────────────────────────────────────────────────────────
function LessonPicker({ currentLesson, completedLessons, onSelect }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Denní slovíčka</h1>
        <p className="text-slate-400 text-sm mt-1">Vyber si lekci a nauč se 3 nová slova</p>
      </div>

      <div className="space-y-3">
        {Array.from({ length: TOTAL_LESSONS }, (_, i) => i + 1).map((day) => {
          const isCompleted = completedLessons.includes(day);
          const isUnlocked = day <= currentLesson;
          const isActive = day === currentLesson && !isCompleted;

          return (
            <button
              key={day}
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onSelect(day)}
              className={`w-full flex items-center gap-4 rounded-2xl p-4 transition-all text-left
                ${isCompleted
                  ? 'bg-emerald-500/10 border border-emerald-500/20'
                  : isActive
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg shadow-indigo-900/30'
                  : isUnlocked
                  ? 'bg-slate-800 hover:bg-slate-700'
                  : 'bg-slate-800/40 opacity-50 cursor-not-allowed'
                }`}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0
                ${isCompleted ? 'bg-emerald-500/20' : isActive ? 'bg-white/20' : 'bg-slate-700'}`}>
                {isCompleted
                  ? <CheckCircle2 size={22} className="text-emerald-400" />
                  : isUnlocked
                  ? <BookOpen size={22} className={isActive ? 'text-white' : 'text-slate-300'} />
                  : <Lock size={22} className="text-slate-600" />
                }
              </div>

              {/* Text */}
              <div className="flex-1">
                <p className={`font-semibold ${isActive ? 'text-white' : isCompleted ? 'text-emerald-300' : 'text-slate-200'}`}>
                  Lekce {day}
                </p>
                <p className={`text-sm ${isActive ? 'text-indigo-200' : isCompleted ? 'text-emerald-400/70' : 'text-slate-500'}`}>
                  {isCompleted ? 'Dokončeno • +30 XP' : isUnlocked ? '3 slovíčka čekají' : 'Zamčeno'}
                </p>
              </div>

              {isUnlocked && !isCompleted && (
                <ChevronRight size={18} className={isActive ? 'text-indigo-200' : 'text-slate-500'} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Completion Screen ────────────────────────────────────────────────────────
function LessonComplete({ lessonDay, onBack, onQuiz }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-900/40">
        <Trophy size={44} className="text-white" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Skvělá práce!</h2>
        <p className="text-slate-400">Dokončil jsi lekci {lessonDay} a získal <span className="text-emerald-400 font-semibold">+30 XP</span></p>
      </div>
      <div className="w-full space-y-3 mt-2">
        <button
          onClick={onQuiz}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 font-semibold text-white shadow-lg shadow-emerald-900/30 hover:opacity-90 transition-opacity"
        >
          Otestovat se (Kvíz) →
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
export default function VocabularyPage() {
  const { state, dispatch, setActivePage } = useApp();
  const { currentLesson, completedLessons } = state;

  const [activeLesson, setActiveLesson] = useState(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [lessonDone, setLessonDone] = useState(false);

  const words = activeLesson ? getWordsForLesson(activeLesson) : [];

  const startLesson = (day) => {
    setActiveLesson(day);
    setWordIndex(0);
    setLessonDone(false);
  };

  const handleNext = () => {
    if (wordIndex < words.length - 1) {
      setWordIndex(wordIndex + 1);
    } else {
      // Complete the lesson
      dispatch({
        type: 'COMPLETE_LESSON',
        payload: {
          lessonDay: activeLesson,
          wordIds: words.map((w) => w.id),
        },
      });
      setLessonDone(true);
    }
  };

  const handleBack = () => {
    setActiveLesson(null);
    setLessonDone(false);
  };

  // Lesson complete screen
  if (lessonDone) {
    return (
      <LessonComplete
        lessonDay={activeLesson}
        onBack={handleBack}
        onQuiz={() => setActivePage('quiz')}
      />
    );
  }

  // Active lesson – word cards
  if (activeLesson) {
    const word = words[wordIndex];
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
          >
            <ArrowLeft size={18} className="text-slate-300" />
          </button>
          <div className="flex-1">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Lekce {activeLesson}</p>
            <p className="text-sm font-medium text-slate-300">
              Slovíčko {wordIndex + 1} / {words.length}
            </p>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {words.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300
                ${i < wordIndex ? 'bg-emerald-500' : i === wordIndex ? 'bg-indigo-500' : 'bg-slate-700'}`}
            />
          ))}
        </div>

        {/* Word card */}
        <WordCard
          key={word.id}
          word={word}
          onNext={handleNext}
          isLast={wordIndex === words.length - 1}
        />
      </div>
    );
  }

  // Lesson picker
  return (
    <LessonPicker
      currentLesson={currentLesson}
      completedLessons={completedLessons}
      onSelect={startLesson}
    />
  );
}
