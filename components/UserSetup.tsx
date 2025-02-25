"use client"

import { useState } from "react"
import { useFlowStore } from "@/store/useFlowStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

export default function UserSetup() {
  const { setUserInfo } = useFlowStore()
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError("Please enter your name to continue")
      return
    }
    
    setUserInfo({ name: name.trim() })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Welcome to Southern Smiles Call Flow</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <p>Please enter your name to continue</p>
              <p className="text-sm text-muted-foreground">This helps track which team member handled the call</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user-name">Your Name</Label>
              <Input
                id="user-name"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setError("")
                }}
                required
                className={error ? "border-red-500" : ""}
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            Start Call Flow
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}