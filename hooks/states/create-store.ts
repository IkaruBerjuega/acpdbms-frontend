import {
  AddPhaseShortcut,
  ProjectSelector,
  SupportedTableTypes,
} from "@/lib/definitions";
import { File, TaskFile } from "@/lib/files-definitions";
import { TaskItem, TaskStatuses } from "@/lib/tasks-definitions";
import { create } from "zustand";
import { combine } from "zustand/middleware";

// accept argument of type T or a callback using previous state of type T
type ReactStyleStateSetter<T> = T | ((prev: T) => T);
// Define a generic state structure
type CreateStore<T> = {
  data: T[];
};

// Define a generic setter function
export const createStore = <T>(initialData?: T[]) =>
  create(
    combine<
      CreateStore<T>,
      {
        getData: () => T[];
        resetData: () => void;
        logData: () => void;
        setData: (newArrOrSetterFn: ReactStyleStateSetter<T[]>) => void;
      }
    >(
      { data: initialData || [] }, // Initial state
      (set, get) => ({
        getData: () => get().data,
        resetData: () => set({ data: [] }), // Reset function
        logData: () => console.log(get().data), // Log function
        setData: (newArrOrSetterFn) => {
          set(({ data }) => {
            // your type check equivalent here
            if (Array.isArray(newArrOrSetterFn)) {
              return { data: newArrOrSetterFn as T[] };
            }
            if (typeof newArrOrSetterFn === "function") {
              return {
                data: (newArrOrSetterFn as (prev: T[]) => T[])(data as T[]),
              };
            }
            return { data };
          });
        },
      })
    )
  );

// Create Zustand store
export const useCheckboxStore = createStore<SupportedTableTypes>([]);
export const useSelectFiles = createStore<File | undefined>([]);
export const useTaskSelectFile = createStore<string | undefined>([]);
export const useProjectSelectStore = createStore<ProjectSelector>();
export const usePhaseTransfer = createStore<AddPhaseShortcut>([]);
export const useSelectedTaskStatus = createStore<TaskStatuses | undefined>();
export const useDeviceTokenStore = createStore<string | undefined>([]);
export const useTaskToUpdateDetails = createStore<TaskItem | undefined>([]);
