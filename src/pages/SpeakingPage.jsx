import { useState, useCallback } from 'react';
import { Mic, MicOff, ChevronRight, Lock, ArrowLeft, Eye, CheckCircle2, AlertCircle, MinusCircle, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getExercisesForLesson } from '../data/exercises';
import { useSpeech } from '../hooks/useSpeech';
import { TOTAL_LESSONS } from '../data/vocabulary';

// ─── Lesson Picker ────────────────────────────────────────────────────────────
function LessonPicker({ completedLessons, speakingAttempts, onSelect }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Mluvení</h1>
        <p className="text-slate-400 text-sm mt-1">Procvičuj popis a volné téma v angličtině</p>
      </div>

      <div className="space-y-3">
        {Array.from({ length: TOTAL_LESSONS }, (_, i) => i + 1).map((day) => {
          const isUnlocked = completedLessons.includes(day);
          const exercises = getExercisesForLesson(day);
          const done = exercises.filter((ex) => speakingAttempts[ex.id]).length;

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
                ${isUnlocked ? 'bg-rose-500/20' : 'bg-slate-700'}`}>
                {isUnlocked
                  ? <Mic size={22} className="text-rose-400" />
                  : <Lock size={22} className="text-slate-600" />
                }
              </div>

              <div className="flex-1">
                <p className="font-semibold text-slate-200">Lekce {day} — Mluvení</p>
                <p className="text-sm text-slate-500">
                  {!isUnlocked
                    ? 'Nejdřív dokonči lekci ve Slovíčkách'
                    : `${done} / ${exercises.length} cvičení splněno`}
                </p>
              </div>

              {isUnlocked && <ChevronRight size={18} className="text-slate-500 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Exercise Picker ──────────────────────────────────────────────────────────
function ExercisePicker({ exercises, speakingAttempts, onSelect, onBack }) {
  const typeLabel = { describe_image: '🖼 Popis obrázku', free_topic: '💬 Volné téma', rewrite_text: '✏️ Přepis textu' };

  return (
    <div className="space-y-5">
      <button onClick={onBack} className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center">
        <ArrowLeft size={18} className="text-slate-300" />
      </button>

      <h2 className="text-xl font-bold text-white">Vyber cvičení</h2>

      <div className="space-y-3">
        {exercises.map((ex) => {
          const attempt = speakingAttempts[ex.id];
          return (
            <button
              key={ex.id}
              onClick={() => onSelect(ex)}
              className="w-full flex items-center gap-4 rounded-2xl p-4 bg-slate-800 hover:bg-slate-700 transition-all text-left"
            >
              <div className="flex-1">
                <p className="text-xs text-slate-500 mb-0.5">{typeLabel[ex.type] ?? ex.type}</p>
                <p className="font-semibold text-slate-200">{ex.title}</p>
                <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{ex.promptCzech}</p>
              </div>
              {attempt && <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />}
              {!attempt && <ChevronRight size={18} className="text-slate-500 shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Speaking Input ───────────────────────────────────────────────────────────
function SpeakingInput({ exercise, onSubmit }) {
  const [text, setText] = useState('');
  const [showImage, setShowImage] = useState(true);

  const { isSupported, isListening, transcript, startListening, stopListening, resetTranscript } = useSpeech({
    onResult: (result) => setText((prev) => (prev + ' ' + result).trim()),
  });

  const handleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      resetTranscript();
      startListening();
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const enoughWords = wordCount >= exercise.minWords;

  return (
    <div className="space-y-4">
      {/* Prompt */}
      <div className="bg-slate-800/60 rounded-2xl p-4 space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Zadání</p>
        <p className="text-slate-200 font-medium leading-relaxed">{exercise.promptCzech}</p>
        {exercise.sourceText && (
          <div className="mt-2 bg-slate-700/60 rounded-xl p-3 text-slate-300 text-sm italic border-l-2 border-indigo-500">
            {exercise.sourceText}
          </div>
        )}
      </div>

      {/* Image */}
      {exercise.imageUrl && (
        <div className="rounded-2xl overflow-hidden">
          {showImage ? (
            <img
              src={exercise.imageUrl}
              alt={exercise.imageAlt}
              className="w-full h-48 object-cover"
              onError={() => setShowImage(false)}
            />
          ) : (
            <div className="h-48 bg-slate-800 flex items-center justify-center text-slate-500 text-sm">
              Obrázek nelze načíst
            </div>
          )}
        </div>
      )}

      {/* Text area */}
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Napiš svou odpověď v angličtině..."
          rows={5}
          className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-4 py-3 text-slate-200 placeholder-slate-600 resize-none focus:outline-none focus:border-indigo-500 transition-colors text-sm leading-relaxed"
        />
        <div className={`absolute bottom-3 right-3 text-xs font-semibold ${enoughWords ? 'text-emerald-400' : 'text-slate-600'}`}>
          {wordCount} / {exercise.minWords} slov
        </div>
      </div>

      {/* Mic button */}
      {isSupported && (
        <button
          onClick={handleMic}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl border transition-colors font-semibold text-sm
            ${isListening
              ? 'bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-indigo-500 hover:text-indigo-300'
            }`}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          {isListening ? 'Nahrávám... (klikni pro stop)' : 'Diktovat místo psaní'}
        </button>
      )}

      {/* Submit */}
      <button
        disabled={!enoughWords}
        onClick={() => onSubmit(text)}
        className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold transition-colors
          ${enoughWords
            ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
            : 'bg-slate-800 text-slate-600 cursor-not-allowed'
          }`}
      >
        <Send size={18} />
        Zobrazit vzorovou odpověď
      </button>
    </div>
  );
}

// ─── Feedback Screen ──────────────────────────────────────────────────────────
function FeedbackScreen({ exercise, userAnswer, onRate }) {
  const [showExample, setShowExample] = useState(false);

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-white">Jak ti to šlo?</h2>

      {/* User's answer */}
      <div className="bg-slate-800/60 rounded-2xl p-4 space-y-2">
        <p className="text-xs text-slate-500 uppercase tracking-wider">Tvoje odpověď</p>
        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{userAnswer}</p>
      </div>

      {/* Example answer toggle */}
      <button
        onClick={() => setShowExample((s) => !s)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors text-sm font-semibold"
      >
        <Eye size={16} />
        {showExample ? 'Skrýt vzorovou odpověď' : 'Zobrazit vzorovou odpověď'}
      </button>

      {showExample && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 space-y-2">
          <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Vzorová odpověď</p>
          <p className="text-slate-200 text-sm leading-relaxed">{exercise.exampleAnswer}</p>
        </div>
      )}

      {/* Self-rating */}
      <div>
        <p className="text-slate-400 text-sm text-center mb-3">Jak bys ohodnotil/a svou odpověď?</p>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onRate(1)}
            className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
          >
            <AlertCircle size={22} className="text-rose-400" />
            <span className="text-xs font-semibold text-rose-400">Těžké</span>
          </button>
          <button
            onClick={() => onRate(2)}
            className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
          >
            <MinusCircle size={22} className="text-amber-400" />
            <span className="text-xs font-semibold text-amber-400">Ujde to</span>
          </button>
          <button
            onClick={() => onRate(3)}
            className="flex flex-col items-center gap-2 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-colors"
          >
            <CheckCircle2 size={22} className="text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">Šlo to</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SpeakingPage() {
  const { state, dispatch } = useApp();
  const { completedLessons, speakingAttempts } = state;

  const [lessonDay, setLessonDay] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [phase, setPhase] = useState('pick_lesson'); // pick_lesson | pick_exercise | input | feedback

  const handleSelectLesson = useCallback((day) => {
    setLessonDay(day);
    setPhase('pick_exercise');
  }, []);

  const handleSelectExercise = useCallback((ex) => {
    setExercise(ex);
    setUserAnswer('');
    setPhase('input');
  }, []);

  const handleSubmit = useCallback((answer) => {
    setUserAnswer(answer);
    setPhase('feedback');
  }, []);

  const handleRate = useCallback((score) => {
    dispatch({
      type: 'RECORD_SPEAKING_ATTEMPT',
      payload: { exerciseId: exercise.id, score },
    });
    setPhase('pick_exercise');
  }, [dispatch, exercise]);

  const handleBack = useCallback(() => {
    if (phase === 'input' || phase === 'feedback') {
      setPhase('pick_exercise');
    } else if (phase === 'pick_exercise') {
      setLessonDay(null);
      setPhase('pick_lesson');
    }
  }, [phase]);

  if (phase === 'pick_lesson') {
    return (
      <LessonPicker
        completedLessons={completedLessons}
        speakingAttempts={speakingAttempts}
        onSelect={handleSelectLesson}
      />
    );
  }

  if (phase === 'pick_exercise') {
    const exercises = getExercisesForLesson(lessonDay);
    return (
      <ExercisePicker
        exercises={exercises}
        speakingAttempts={speakingAttempts}
        onSelect={handleSelectExercise}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center shrink-0"
        >
          <ArrowLeft size={18} className="text-slate-300" />
        </button>
        <div>
          <p className="text-xs text-slate-500">Lekce {lessonDay} · Mluvení</p>
          <p className="text-sm font-semibold text-slate-200">{exercise?.title}</p>
        </div>
      </div>

      {phase === 'input' && (
        <SpeakingInput exercise={exercise} onSubmit={handleSubmit} />
      )}
      {phase === 'feedback' && (
        <FeedbackScreen exercise={exercise} userAnswer={userAnswer} onRate={handleRate} />
      )}
    </div>
  );
}
