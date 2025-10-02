import { Imovel, ImovelImages, User } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type dashboardT = {
  currentPost: Imovel | null;
  currentImages: ImovelImages[];
  set: (post: Imovel) => void;
  setImages: (images: ImovelImages[]) => void;
};

export const useDashboardStore = create<dashboardT>()((set) => ({
  currentPost: null,
  currentImages: [],
  set: (post) => set({ currentPost: post }),
  setImages: (data) => set({ currentImages: data }),
}));
