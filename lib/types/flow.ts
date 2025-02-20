// types/flow.ts
export interface Choice {
  text: string;
  next: string;
}

export interface Step {
  text: string;
  choices: Choice[];
}

export interface FlowData {
  start: string;
  steps: {
    [key: string]: Step;
  };
}