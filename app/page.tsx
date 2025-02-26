"use client"

import FlowChart from "@/components/FlowChart"
import UserSetup from "@/components/UserSetup"
import { useFlowStore } from "@/store/useFlowStore"

export default function Home() {
  const { isUserSetup } = useFlowStore()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 md:p-24">
      <img className="mb-20" src="/images/ssmiles-logo.png" alt="Southern Smiles Logo" />
      
      {isUserSetup ? (
        <FlowChart />
      ) : (
        <UserSetup />
      )}
    </main>
  )
}