"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft, RotateCcw, AlertTriangle, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useFlowStore } from "@/store/useFlowStore"
import flowData from "@/data/flow-data.json"
import { FlowData } from "@/lib/types/flow"
import ExportCallsButton from "./ExportCallsButton"

// FlowChart component meow
export default function FlowChart() {
  const {
    currentStep,
    handleChoice,
    goBack,
    reset,
    getCurrentStep,
    history,
    patientInfo,
    userInfo,
    setFieldValue,
    finishCall
  } = useFlowStore()
  
  const [tempFieldValues, setTempFieldValues] = useState<Record<string, string>>({})
  const step = getCurrentStep();
  const typedFlowData = flowData as FlowData;

  const handleInputChange = (field: string, value: string) => {
    setTempFieldValues(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleChoiceWithData = (nextStep: string) => {
    // Save any temporary field values to the store
    Object.entries(tempFieldValues).forEach(([field, value]) => {
      setFieldValue(field, value)
    })
    
    // Clear temporary values
    setTempFieldValues({})
    
    // Navigate to next step
    handleChoice(nextStep)
  }
  
  // Function to replace placeholders in text with actual patient info
  const replacePlaceholders = (text: string) => {
    if (!text) return '';
    
    let processedText = text;
    
    // Replace [Name] with the user's (receptionist's) name
    if (userInfo.name) {
      processedText = processedText.replace(/\[Name\]/gi, userInfo.name);
    }
    
    // Replace [Pt Name] or [Pt name] with the patient's name
    if (patientInfo.name) {
      processedText = processedText.replace(/\[Pt Name\]/gi, patientInfo.name);
    }
    
    // Replace [appointment time] placeholder (could be implemented later with actual scheduling)
    processedText = processedText.replace(/\[appointment time\]/gi, "your scheduled time");
    
    // Replace [earliest available emergency slot] placeholder
    processedText = processedText.replace(
      /\[earliest available emergency slot\]/gi, 
      "our next available emergency slot"
    );
    
    // Replace [earliest prophy appointment] placeholder
    processedText = processedText.replace(
      /\[earliest prophy appointment\]/gi, 
      "our next available appointment"
    );
    
    return processedText;
  };

  // Apply replacements to the step text
  const displayText = replacePlaceholders(step.text);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Check if we're at the end of the call flow
  const isEndOfCall = currentStep === "end_call" || currentStep === "end_call_emergency";

  return (
    <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
      {/* Export Call Data UI */}
      <div className="mb-6">
        <ExportCallsButton />
      </div>

      {step.text && (
        <div className="mb-6">
          {!typedFlowData.steps[currentStep] && (
            <div className="flex items-center gap-2 text-amber-600 mb-2 p-2 bg-amber-50 rounded-md">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-medium">Incomplete path</span>
            </div>
          )}
          <h2 className="text-2xl font-semibold">{displayText}</h2>
        </div>
      )}

      {/* End of call message and finish button */}
      {isEndOfCall && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-medium text-green-800 mb-2">End of Call</h3>
          <p className="text-green-700 mb-4">
            This call has been completed. You can now save this call to your records and start a new one.
          </p>
          <Button 
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700" 
            onClick={finishCall}
          >
            <Save className="h-4 w-4" />
            Finish & Save Call
          </Button>
        </div>
      )}

      {/* Data collection form */}
      {step.dataCollection && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Label htmlFor={step.dataCollection.field}>
                {step.dataCollection.label}
                {step.dataCollection.required && <span className="text-red-500">*</span>}
              </Label>
              
              {step.dataCollection.type === 'text' && (
                <Input
                  id={step.dataCollection.field}
                  placeholder={step.dataCollection.placeholder}
                  value={tempFieldValues[step.dataCollection.field] || ''}
                  onChange={(e) => step.dataCollection && handleInputChange(step.dataCollection.field, e.target.value)}
                  required={step.dataCollection.required}
                />
              )}

              {step.dataCollection.type === 'phone' && (
                <Input
                  id={step.dataCollection.field}
                  type="tel"
                  placeholder={step.dataCollection.placeholder || 'Phone number'}
                  value={tempFieldValues[step.dataCollection.field] || ''}
                  onChange={(e) => step.dataCollection && handleInputChange(step.dataCollection.field, e.target.value)}
                  required={step.dataCollection.required}
                />
              )}

              {step.dataCollection.type === 'textarea' && (
                <Textarea
                  id={step.dataCollection.field}
                  placeholder={step.dataCollection.placeholder}
                  value={tempFieldValues[step.dataCollection.field] || ''}
                  onChange={(e) => step.dataCollection && handleInputChange(step.dataCollection.field, e.target.value)}
                  required={step.dataCollection.required}
                />
              )}

              {step.dataCollection.type === 'select' && step.dataCollection.options && (
                <Select 
                  value={tempFieldValues[step.dataCollection.field] || ''} 
                  onValueChange={(value) => step.dataCollection && handleInputChange(step.dataCollection.field, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={step.dataCollection.placeholder || 'Select an option'} />
                  </SelectTrigger>
                  <SelectContent>
                    {step.dataCollection.options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {step.dataCollection.type === 'date' && (
                <Input
                  id={step.dataCollection.field}
                  type="date"
                  value={tempFieldValues[step.dataCollection.field] || ''}
                  onChange={(e) => step.dataCollection && handleInputChange(step.dataCollection.field, e.target.value)}
                  required={step.dataCollection.required}
                />
              )}

              {step.dataCollection.type === 'email' && (
                <Input
                  id={step.dataCollection.field}
                  type="email"
                  placeholder={step.dataCollection.placeholder || 'Email address'}
                  value={tempFieldValues[step.dataCollection.field] || ''}
                  onChange={(e) => step.dataCollection && handleInputChange(step.dataCollection.field, e.target.value)}
                  required={step.dataCollection.required}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="space-y-4">
        {step.choices && step.choices.map((choice, index) => {
          // Apply replacements to choice text as well
          const choiceText = replacePlaceholders(choice.text);
          
          return (
            <Button 
              key={index} 
              onClick={() => handleChoiceWithData(choice.next)} 
              className="w-full justify-start"
              disabled={!typedFlowData.steps[choice.next]}
            >
              <ChevronRight className="mr-2 h-4 w-4" />
              {choiceText}
              {!typedFlowData.steps[choice.next] && (
                <span className="ml-auto text-xs text-zinc-500">(Not implemented)</span>
              )}
            </Button>
          );
        })}
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
        {isEndOfCall ? (
          <Button 
            variant="default" 
            onClick={finishCall}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Finish Call
          </Button>
        ) : (
          <Button variant="outline" onClick={reset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        )}
      </div>

      {/* Patient Information Display */}
      {(patientInfo.name || patientInfo.phoneNumber || patientInfo.referralSource || patientInfo.visitReason) && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Patient Information</h3>
            <dl className="divide-y">
              {patientInfo.name && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-sm">Name:</dt>
                  <dd className="text-sm">{patientInfo.name}</dd>
                </div>
              )}
              {patientInfo.phoneNumber && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-sm">Phone:</dt>
                  <dd className="text-sm">{patientInfo.phoneNumber}</dd>
                </div>
              )}
              {patientInfo.referralSource && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-sm">Referral Source:</dt>
                  <dd className="text-sm">{patientInfo.referralSource}</dd>
                </div>
              )}
              {patientInfo.visitReason && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-sm">Reason for Visit:</dt>
                  <dd className="text-sm">{patientInfo.visitReason}</dd>
                </div>
              )}
              {patientInfo.insuranceType && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-sm">Insurance:</dt>
                  <dd className="text-sm">{patientInfo.insuranceType}</dd>
                </div>
              )}
              {patientInfo.appointmentType && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-sm">Appointment Type:</dt>
                  <dd className="text-sm">{patientInfo.appointmentType}</dd>
                </div>
              )}
              {patientInfo.dateOfBirth && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-sm">Date of Birth:</dt>
                  <dd className="text-sm">{patientInfo.dateOfBirth}</dd>
                </div>
              )}
              {patientInfo.email && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-sm">Email:</dt>
                  <dd className="text-sm">{patientInfo.email}</dd>
                </div>
              )}
              {patientInfo.address && (
                <div className="py-2 flex justify-between">
                  <dt className="font-medium text-sm">Address:</dt>
                  <dd className="text-sm">{patientInfo.address}</dd>
                </div>
              )}
              <div className="py-2 flex justify-between">
                <dt className="font-medium text-sm">Call Date:</dt>
                <dd className="text-sm">{formatDate(patientInfo.callDate)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      )}
      
      {/* User (Receptionist) Info Display */}
      <div className="mt-6 text-right">
        <span className="text-sm text-muted-foreground">
          Call handler: <span className="font-medium">{userInfo.name}</span>
        </span>
      </div>
    </div>
  )
}