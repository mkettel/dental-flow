"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft, RotateCcw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import flowData from "@/data/flow-data.json"
import { FlowData, Step } from "@/lib/types/flow"

export default function FlowChart() {
  const typedFlowData = flowData as FlowData
  const [currentStep, setCurrentStep] = useState<string>(typedFlowData.start)
  const [history, setHistory] = useState<string[]>([])

  // Handle the user's choice
  const handleChoice = (nextStep: string) => {
    // Check if the next step exists
    if (!typedFlowData.steps[nextStep]) {
      return; // Don't navigate to non-existent steps
    }
    
    // Save the current step to the history
    setHistory([...history, currentStep])
    
    // Move to the next step
    setCurrentStep(nextStep)
  }

  const handleBack = () => {
    if (history.length > 0) {
      // Create a copy of history to work with
      const newHistory = [...history]
      const prevStep = newHistory.pop()
      
      // Update history state
      setHistory(newHistory)
      
      // Move back to previous step
      if (prevStep && typedFlowData.steps[prevStep]) {
        setCurrentStep(prevStep)
      } else {
        // If previous step doesn't exist anymore, go to start
        setCurrentStep(typedFlowData.start)
      }
    }
  }

  const handleReset = () => {
    setCurrentStep(typedFlowData.start)
    setHistory([])
  }

  // Safely get the current step, or default to a placeholder
  const getCurrentStep = (): Step => {
    const step = typedFlowData.steps[currentStep];
    if (!step) {
      return {
        text: `This path (${currentStep}) is not yet implemented.`,
        choices: [
          {
            text: "Go back",
            next: history.length > 0 ? history[history.length - 1] : typedFlowData.start
          }
        ]
      };
    }
    return step;
  };

  const step = getCurrentStep();

  return (
    <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
      {step.text && (
        <div className="mb-6">
          {!typedFlowData.steps[currentStep] && (
            <div className="flex items-center gap-2 text-amber-600 mb-2 p-2 bg-amber-50 rounded-md">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">Incomplete path</span>
            </div>
          )}
          <h2 className="text-2xl font-semibold">{step.text}</h2>
        </div>
      )}
      
      <div className="space-y-4">
        {step.choices && step.choices.map((choice, index) => (
          <Button 
            key={index} 
            onClick={() => handleChoice(choice.next)} 
            className="w-full justify-start"
            disabled={!typedFlowData.steps[choice.next]}
          >
            <ChevronRight className="mr-2 h-4 w-4" />
            {choice.text}
            {!typedFlowData.steps[choice.next] && (
              <span className="ml-auto text-xs text-zinc-500">(Not implemented)</span>
            )}
          </Button>
        ))}
      </div>
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          disabled={history.length === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  )
}