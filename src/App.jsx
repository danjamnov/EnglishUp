import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/layout/Navigation';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import VocabularyPage from './pages/VocabularyPage';
import QuizPage from './pages/QuizPage';
import SpeakingPage from './pages/SpeakingPage';

function PageRouter() {
  const { user, authLoading, state, setActivePage } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-slate-400 text-sm animate-pulse">Načítání...</div>
      </div>
    );
  }

  if (!user) return <AuthPage />;

  const pages = {
    home: <HomePage />,
    vocabulary: <VocabularyPage />,
    quiz: <QuizPage />,
    speaking: <SpeakingPage />,
  };

  // Adapter: components use dispatch({type:'SET_PAGE'}) – intercept here
  return (
    <div className="min-h-screen bg-slate-950 pb-20 pt-16">
      <Navigation />
      <main className="max-w-lg mx-auto px-4 py-6">
        {pages[state.activePage] ?? <HomePage />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <PageRouter />
    </AppProvider>
  );
}
