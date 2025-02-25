// types/flow.ts
export interface Choice {
  text: string;
  next: string;
  collectData?: {
    field: string;
    type: 'text' | 'phone' | 'select' | 'date' | 'email';
    options?: string[]; // For select fields
    placeholder?: string;
    required?: boolean;
  };
}

export interface Step {
  text: string;
  choices: Choice[];
  dataCollection?: {
    field: string;
    type: 'text' | 'phone' | 'select' | 'textarea' | 'date' | 'email';
    label: string;
    placeholder?: string;
    options?: string[]; // For select fields
    required?: boolean;
  };
}

export interface FlowData {
  start: string;
  steps: {
    [key: string]: Step;
  };
}

export interface PatientInfo {
  name: string;
  phoneNumber: string;
  referralSource?: string;
  visitReason?: string;
  insuranceType?: 'access' | 'delta' | 'cigna' | 'other' | null;
  appointmentType?: 'routine' | 'emergency' | 'other';
  dateOfBirth?: string;
  address?: string;
  email?: string;
}