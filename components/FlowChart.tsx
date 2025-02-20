"use client"

import { ChevronRight, ChevronLeft, RotateCcw, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFlowStore } from "@/store/useFlowStore"
import flowData from "@/data/flow-data.json"
import { FlowData } from "@/lib/types/flow"

export default function FlowChart() {
  const {
    currentStep,
    handleChoice,
    goBack,
    reset,
    getCurrentStep,
    history
  } = useFlowStore()

  const step = getCurrentStep();
  const typedFlowData = flowData as FlowData;

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
          onClick={goBack} 
          disabled={history.length === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button variant="outline" onClick={reset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    </div>
  )
}