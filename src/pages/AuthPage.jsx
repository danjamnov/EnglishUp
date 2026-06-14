import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Chrome } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthPage() {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail } = useApp();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'error'|'success', text }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const fn = mode === 'login' ? signInWithEmail : signUpWithEmail;
    const { error, data } = await fn(email, password);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else if (mode === 'register' && !data.session) {
      setMessage({ type: 'success', text: 'Zkontroluj email a potvrď registraci.' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="text-5xl">🇬🇧</div>
          <h1 className="text-3xl font-bold text-white tracking-tight">EnglishUp</h1>
          <p className="text-slate-400 text-sm">Nauč se anglicky – krok za krokem</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800 rounded-3xl p-6 space-y-4">
          {/* Google */}
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold py-3 rounded-2xl transition-colors"
          >
            <Chrome size={20} />
            Přihlásit přes Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-slate-500 text-xs">nebo emailem</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                placeholder="tvuj@email.cz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-700 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Heslo"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-700 text-white placeholder-slate-500 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {message && (
              <p className={`text-sm px-3 py-2 rounded-xl ${
                message.type === 'error'
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-emerald-500/10 text-emerald-400'
              }`}>
                {message.text}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:opacity-90 disabled:opacity-50 text-white font-semibold py-3 rounded-2xl transition-opacity"
            >
              {loading ? 'Načítání...' : mode === 'login' ? 'Přihlásit se' : 'Vytvořit účet'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400">
            {mode === 'login' ? 'Nemáš účet? ' : 'Máš účet? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setMessage(null); }}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              {mode === 'login' ? 'Registruj se' : 'Přihlás se'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
