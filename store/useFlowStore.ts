// store/useFlowStore.ts
import { create } from 'zustand'
import flowData from '@/data/flow-data.json'
import { FlowData, Step, PatientInfo } from '@/lib/types/flow'

interface FlowState {
  currentStep: string;
  history: string[];
  patientInfo: PatientInfo;
  // Actions
  setCurrentStep: (step: string) => void;
  goBack: () => void;
  reset: () => void;
  updatePatientInfo: (info: Partial<PatientInfo>) => void;
  // Navigation helpers
  handleChoice: (nextStep: string) => void;
  getCurrentStep: () => Step;
  // Data collection
  setFieldValue: (field: string, value: string) => void;
}

export const useFlowStore = create<FlowState>((set, get) => ({
  currentStep: (flowData as FlowData).start,
  history: [],
  patientInfo: {
    name: '',
    phoneNumber: '',
    referralSource: '',
    visitReason: '',
    insuranceType: null,
    appointmentType: undefined,
    dateOfBirth: '',
    address: '',
    email: '',
  },

  setCurrentStep: (step: string) => set({ currentStep: step }),
  
  goBack: () => set(state => {
    if (state.history.length > 0) {
      const newHistory = [...state.history];
      const prevStep = newHistory.pop() || (flowData as FlowData).start;
      return {
        currentStep: prevStep,
        history: newHistory,
      };
    }
    return state;
  }),

  reset: () => set({
    currentStep: (flowData as FlowData).start,
    history: [],
    patientInfo: {
      name: '',
      phoneNumber: '',
      referralSource: '',
      visitReason: '',
      insuranceType: null,
      appointmentType: undefined,
      dateOfBirth: '',
      address: '',
      email: '',
    },
  }),

  updatePatientInfo: (info: Partial<PatientInfo>) => set(state => ({
    patientInfo: { ...state.patientInfo, ...info }
  })),

  setFieldValue: (field: string, value: string) => set(state => ({
    patientInfo: { 
      ...state.patientInfo, 
      [field]: value 
    }
  })),

  handleChoice: (nextStep: string) => set(state => {
    const steps = (flowData as FlowData).steps;
    if (!steps[nextStep]) return state;

    return {
      currentStep: nextStep,
      history: [...state.history, state.currentStep],
    };
  }),

  getCurrentStep: () => {
    const state = get();
    const steps = (flowData as FlowData).steps;
    const step = steps[state.currentStep];

    if (!step) {
      return {
        text: `This path (${state.currentStep}) is not yet implemented.`,
        choices: [{
          text: "Go back",
          next: state.history.length > 0 
            ? state.history[state.history.length - 1] 
            : (flowData as FlowData).start
        }]
      };
    }

    return step;
  },
}));