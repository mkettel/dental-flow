"use client"

import { useState } from "react"
import { ChevronRight, ChevronLeft, RotateCcw, AlertTriangle } from "lucide-react"
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

export default function FlowChart() {
  const {
    currentStep,
    handleChoice,
    goBack,
    reset,
    getCurrentStep,
    history,
    patientInfo,
    setFieldValue
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
        {step.choices && step.choices.map((choice, index) => (
          <Button 
            key={index} 
            onClick={() => handleChoiceWithData(choice.next)} 
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
            </dl>
          </CardContent>
        </Card>
      )}
    </div>
  )
}