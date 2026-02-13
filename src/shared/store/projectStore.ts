// src/shared/store/projectStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Project = {
  id: string;
  name: string;
};

interface ProjectStore {
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  clearProject: () => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      selectedProject: null,
      setSelectedProject: (project) => set({ selectedProject: project }),
      clearProject: () => set({ selectedProject: null }),
    }),
    {
      name: "pem-project-storage", // localStorage key
    }
  )
);
