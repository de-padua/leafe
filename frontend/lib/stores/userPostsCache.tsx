import { Imovel } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type cacheStorageT = {
  history: Imovel[];
  add: (data: Imovel) => void;
  remove: (id: string) => void;
  overide:(data:Imovel) => void
};

export const useCacheStorage = create<cacheStorageT>()(
  persist<cacheStorageT>(
    (set, get) => ({
      history: [],
      remove: (data) => {
        const x = get().history;

        const newData = x.filter((i) =>  i.id !== data);
        set({ history: newData });
      },
      add: (data) => {
        const currentHistory = get().history;
        if (currentHistory.find((item) => item.id === data.id)) return;
        set({ history: [...currentHistory, data] });
      },
      overide: (data) => {
        const currentHistory = get().history;
        const newData = currentHistory.filter((item) => item.id !== data.id)
        set({ history: [...newData, data] });
      },
    }),
    {
      name: "cache-user-posts",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
