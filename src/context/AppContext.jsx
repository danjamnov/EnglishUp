import { createContext, useContext, useReducer, useEffect, useState, useCallback } from 'react';
import { supabase, loadProgress, saveProgress } from '../lib/supabase';
import { TOTAL_LESSONS } from '../data/vocabulary';

// ─── Initial State ────────────────────────────────────────────────────────────
const INITIAL_PROGRESS = {
  currentLesson: 1,
  completedLessons: [],
  unlockedWordIds: [],
  streak: 0,
  lastActiveDate: null,
  xp: 0,
  quizScores: {},
  speakingAttempts: {},
  // flashcardMastery: { [wordId]: 'unknown' | 'unsure' | 'known' }
  flashcardMastery: {},
  // activityLog: array of date strings 'YYYY-MM-DD' (deduplicated)
  activityLog: [],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function stampActivity(log) {
  const today = new Date().toISOString().split('T')[0];
  return log.includes(today) ? log : [...log, today];
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function progressReducer(state, action) {
  switch (action.type) {
    case 'COMPLETE_LESSON': {
      const { lessonDay, wordIds } = action.payload;
      const alreadyCompleted = state.completedLessons.includes(lessonDay);
      const today = new Date().toISOString().split('T')[0];

      let newStreak = state.streak;
      if (state.lastActiveDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yStr = yesterday.toISOString().split('T')[0];
        newStreak = state.lastActiveDate === yStr ? state.streak + 1 : 1;
      }

      return {
        ...state,
        completedLessons: alreadyCompleted ? state.completedLessons : [...state.completedLessons, lessonDay],
        unlockedWordIds: [...new Set([...state.unlockedWordIds, ...wordIds])],
        xp: state.xp + (alreadyCompleted ? 0 : 30),
        streak: newStreak,
        lastActiveDate: today,
        currentLesson: Math.min(Math.max(state.currentLesson, lessonDay + 1), TOTAL_LESSONS + 1),
        activityLog: stampActivity(state.activityLog ?? []),
      };
    }

    case 'RECORD_QUIZ_SCORE': {
      const { lessonDay, correct, total } = action.payload;
      return {
        ...state,
        quizScores: { ...state.quizScores, [lessonDay]: { correct, total } },
        xp: state.xp + correct * 10,
        activityLog: stampActivity(state.activityLog ?? []),
      };
    }

    case 'RECORD_SPEAKING_ATTEMPT': {
      const { exerciseId, score } = action.payload;
      const prev = state.speakingAttempts[exerciseId] || { attempts: 0, lastScore: 0 };
      return {
        ...state,
        speakingAttempts: {
          ...state.speakingAttempts,
          [exerciseId]: { attempts: prev.attempts + 1, lastScore: score },
        },
        xp: state.xp + 15,
        activityLog: stampActivity(state.activityLog ?? []),
      };
    }

    case 'UPDATE_MASTERY': {
      const { wordId, level } = action.payload; // level: 'unknown' | 'unsure' | 'known'
      return {
        ...state,
        flashcardMastery: { ...state.flashcardMastery, [wordId]: level },
        xp: level === 'known' ? state.xp + 5 : state.xp,
        activityLog: stampActivity(state.activityLog ?? []),
      };
    }

    case 'RESTORE':
      return { ...INITIAL_PROGRESS, ...action.payload };

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [progress, dispatch] = useReducer(progressReducer, INITIAL_PROGRESS);
  const [activePage, setActivePage] = useState('home');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // ── Auth listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load progress from Supabase when user logs in ─────────────────────────
  useEffect(() => {
    if (!user) return;

    setSyncing(true);
    loadProgress(user.id).then((remoteData) => {
      if (remoteData) {
        dispatch({ type: 'RESTORE', payload: remoteData });
      }
      setSyncing(false);
    });
  }, [user]);

  // ── Save to Supabase on every progress change (debounced) ─────────────────
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      saveProgress(user.id, progress);
    }, 1000); // debounce 1s
    return () => clearTimeout(timer);
  }, [user, progress]);

  // ── Auth actions ──────────────────────────────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  }, []);

  const signInWithEmail = useCallback(async (email, password) => {
    return supabase.auth.signInWithPassword({ email, password });
  }, []);

  const signUpWithEmail = useCallback(async (email, password) => {
    return supabase.auth.signUp({ email, password });
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    dispatch({ type: 'RESTORE', payload: INITIAL_PROGRESS });
    setActivePage('home');
  }, []);

  const value = {
    // Progress state
    state: { ...progress, activePage },
    dispatch,
    // Page navigation
    setActivePage,
    // Auth
    user,
    authLoading,
    syncing,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
