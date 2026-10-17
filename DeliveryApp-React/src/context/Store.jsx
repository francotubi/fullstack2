import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createDatabase, DB_KEY } from '../data/database';
const Context = createContext(null);
export function StoreProvider({ children }) {
    const db = useMemo(() => createDatabase(), []);
    const [state, setState] = useState(() => {
        try {
            return db.snapshot();
        } catch {
            return null;
        }
    });
    const [error, setError] = useState(
        state
            ? null
            : 'No se pudieron leer los datos locales. Conserva una copia antes de limpiarlos.',
    );
    const refresh = () => {
        try {
            setState(db.snapshot());
            setError(null);
        } catch (e) {
            setError(e.message);
        }
    };
    useEffect(() => {
        const handler = (e) => {
            if (e.key === DB_KEY || e.key === null) refresh();
        };
        window.addEventListener('storage', handler);
        return () => window.removeEventListener('storage', handler);
    }, [db]);
    const act = (method, ...args) => {
        const result = db[method](...args);
        refresh();
        return result;
    };
    if (!state)
        return (
            <main className="container py-5">
                <h1>No se puede abrir la aplicación</h1>
                <p role="alert">{error}</p>
            </main>
        );
    const user = state.users.find((u) => u.id === state.session) || null;
    return (
        <Context.Provider value={{ state, user, act }}>
            {children}
        </Context.Provider>
    );
}
export const useStore = () => useContext(Context);
