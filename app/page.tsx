import FlowChart from "@/components/FlowChart"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-2 md:p-24">
      <img className=" mb-6" src="/images/ssmiles-logo.png" alt="logo" />
      {/* <h1 className="text-4xl text-center font-bold mb-8">Call Flow</h1> */}
      <FlowChart />
    </main>
  )
}

