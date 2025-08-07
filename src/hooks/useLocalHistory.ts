'use client';
import { useCallback, useEffect, useState } from 'react';
import { nanoid } from 'nanoid/non-secure';

export type LocalSpread = {
  id: string;
  type: 'daily' | 'period';
  date: string;
  cards: { id:number; name:string; reversed:boolean; position:1|2|3 }[];
  resultText?: string;
};

const KEY = 'tarot_local_history_v1';

export function useLocalHistory() {
  const [history, setHistory] = useState<LocalSpread[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setHistory(JSON.parse(raw));
  }, []);
  const save = (h: LocalSpread[]) => {
    setHistory(h);
    localStorage.setItem(KEY, JSON.stringify(h));
  };
  const pushLocal = useCallback((entry: Omit<LocalSpread,'id'>) => {
    const next = [{ id:nanoid(), ...entry }, ...history].slice(0, 100);
    save(next);
  }, [history]);
  return { history, pushLocal, clear: () => save([]) };
}
