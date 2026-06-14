import { Brain } from 'lucide-react';

// Placeholder – bude implementováno v dalším kroku
export default function QuizPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
        <Brain size={36} className="text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white">Kvíz</h2>
      <p className="text-slate-400 max-w-xs">Tato sekce se právě připravuje. Brzy si zde otestuješ slovní zásobu oběma směry!</p>
    </div>
  );
}
