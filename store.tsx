import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from 'react';
import { parseState, reducer, STORAGE_KEY, type DemoState, type Action } from './model';
type Store = {
  state: DemoState;
  dispatch: React.Dispatch<Action>;
  notify: (message: string) => void;
  toast: string;
  storageError: boolean;
};
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    try {
      return parseState(localStorage.getItem(STORAGE_KEY));
    } catch {
      return parseState(null);
    }
  });
  const [toast, setToast] = useState('');
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [state]);
  useEffect(() => {
    document.documentElement.dataset.theme = state.preferences.theme;
    document.documentElement.dataset.motion = String(state.preferences.motion);
  }, [state.preferences]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 4500);
    return () => clearTimeout(timer);
  }, [toast]);
  return (
    <Context.Provider value={{ state, dispatch, notify: (m) => setToast(m), toast, storageError }}>
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const c = useContext(Context);
  if (!c) throw new Error('StoreProvider missing');
  return c;
}
