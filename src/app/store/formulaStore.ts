'use client';

import { create } from 'zustand';

interface FormulaState {
  tags: string[];
  variables: Record<string, number>;
  result: number | null;
  addTag: (tag: string) => void;
  setVariable: (name: string, value: number) => void;
  calculate: () => void;
  clearTags: () => void;
}

export const useFormulaStore = create<FormulaState>((set, get) => ({
  tags: [],
  variables: {},
  result: null,
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  setVariable: (name, value) =>
    set((state) => ({
      variables: { ...state.variables, [name]: value },
    })),
  calculate: () => {
    const { tags, variables } = get();
    const formula = tags
      .map((tag) => (variables[tag] !== undefined ? variables[tag] : tag))
      .join(' ');
    try {
      const result = Function(`return ${formula}`)();
      set({ result });
    } catch (error) {
      set({ result: null });
    }
  },
  clearTags: () => set({ tags: [], result: null }),
})); 