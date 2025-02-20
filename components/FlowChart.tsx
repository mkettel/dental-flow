"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import flowData from "@/data/flow-data.json"
import { FlowData, Step } from "@/lib/types/flow"

export default function FlowChart() {
  const typedFlowData = flowData as FlowData
  const [currentStep, setCurrentStep] = useState<string>(typedFlowData.start)
  const [history, setHistory] = useState<string[]>([])

  // Handle the user's choice
  const handleChoice = (nextStep: string) => {
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
      if (prevStep) {
        setCurrentStep(prevStep)
      }
    }
  }

  const handleReset = () => {
    setCurrentStep(typedFlowData.start)
    setHistory([])
  }

  const step: Step = typedFlowData.steps[currentStep]

  return (
    <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{step.text}</h2>
      <div className="space-y-4">
        {step.choices &&
          step.choices.map((choice, index) => (
            <Button 
              key={index} 
              onClick={() => handleChoice(choice.next)} 
              className="w-full justify-start"
            >
              <ChevronRight className="mr-2 h-4 w-4" />
              {choice.text}
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