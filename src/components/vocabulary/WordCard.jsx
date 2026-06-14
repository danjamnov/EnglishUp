import { useState } from 'react';
import { Volume2, Lightbulb, ChevronRight, Star } from 'lucide-react';

/**
 * WordCard – displays a single vocabulary word with mnemonic and example.
 * Reveals content progressively: word → mnemonic → example.
 */
export default function WordCard({ word, onNext, isLast }) {
  const [stage, setStage] = useState(0);
  // stage 0: show english + phonetic
  // stage 1: reveal czech + mnemonic
  // stage 2: reveal example sentence

  const { english, czech, phonetic, mnemonic, exampleSentence, exampleTranslation, difficulty } = word;

  const difficultyColor = {
    A1: 'text-emerald-400 bg-emerald-400/10',
    A2: 'text-emerald-400 bg-emerald-400/10',
    B1: 'text-blue-400 bg-blue-400/10',
    B2: 'text-indigo-400 bg-indigo-400/10',
    C1: 'text-purple-400 bg-purple-400/10',
    C2: 'text-rose-400 bg-rose-400/10',
  }[difficulty] ?? 'text-slate-400 bg-slate-400/10';

  const speak = () => {
    if ('speechSynthesis' in window) {
      const utter = new SpeechSynthesisUtterance(english);
      utter.lang = 'en-US';
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    }
  };

  const advance = () => {
    if (stage < 2) {
      setStage(stage + 1);
    } else {
      onNext?.();
    }
  };

  const buttonLabel = stage === 0
    ? 'Zobrazit překlad'
    : stage === 1
    ? 'Zobrazit příklad'
    : isLast
    ? 'Dokončit lekci ✓'
    : 'Další slovíčko →';

  return (
    <div className="flex flex-col gap-4">
      {/* Main card */}
      <div className="bg-slate-800 rounded-3xl overflow-hidden shadow-xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600/30 to-purple-600/20 px-6 pt-6 pb-4 flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${difficultyColor}`}>
                {difficulty}
              </span>
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight">{english}</h2>
            {phonetic && (
              <p className="text-slate-400 text-sm mt-1 font-mono">{phonetic}</p>
            )}
          </div>
          <button
            onClick={speak}
            className="w-11 h-11 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors shrink-0 mt-1"
            title="Přehrát výslovnost"
          >
            <Volume2 size={20} className="text-white" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-4 space-y-4">
          {/* Czech translation – revealed at stage 1 */}
          <div className={`transition-all duration-500 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Překlad</p>
            <p className="text-2xl font-semibold text-white">{czech}</p>
          </div>

          {/* Mnemonic – revealed at stage 1 */}
          <div className={`transition-all duration-500 delay-100 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
              <Lightbulb size={18} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">Mnemotechnická pomůcka</p>
                <p className="text-slate-200 text-sm leading-relaxed">{mnemonic}</p>
              </div>
            </div>
          </div>

          {/* Example sentence – revealed at stage 2 */}
          <div className={`transition-all duration-500 delay-150 ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-2">Příklad</p>
            <div className="bg-slate-700/60 rounded-2xl p-4 space-y-1">
              <p className="text-white italic leading-relaxed">"{exampleSentence}"</p>
              <p className="text-slate-400 text-sm">„{exampleTranslation}"</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA button */}
      <button
        onClick={advance}
        className={`w-full py-4 rounded-2xl font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2
          ${stage === 2 && isLast
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-900/40 hover:opacity-90'
            : 'bg-gradient-to-r from-indigo-600 to-purple-700 shadow-lg shadow-indigo-900/40 hover:opacity-90'
          }`}
      >
        {buttonLabel}
        {stage < 2 && <ChevronRight size={18} />}
      </button>
    </div>
  );
}
