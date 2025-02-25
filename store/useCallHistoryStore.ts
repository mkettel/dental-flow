// store/useCallHistoryStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PatientInfo, UserInfo } from '@/lib/types/flow';

// Extended call data that includes handler information
export interface CallRecord extends PatientInfo {
  handlerName: string; // The receptionist who handled the call
}

interface CallHistoryState {
  calls: CallRecord[];
  addCall: (patient: PatientInfo, handler: UserInfo) => void;
  clearCalls: () => void;
}

export const useCallHistoryStore = create<CallHistoryState>()(
  persist(
    (set) => ({
      calls: [],
      
      addCall: (patient: PatientInfo, handler: UserInfo) => set((state) => ({
        calls: [...state.calls, { 
          ...patient,
          handlerName: handler.name
        }]
      })),
      
      clearCalls: () => set({ calls: [] }),
    }),
    {
      name: 'call-history', // name for localStorage key
    }
  )
);