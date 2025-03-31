import FormulaInput from './components/FormulaInput'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Formula Calculator
        </h1>
        <p className="text-lg text-gray-400">
          Enter your formula using numbers, operators (+, -, *, /), and variables. Set variable values below.
        </p>
        <FormulaInput />
      </div>
    </main>
  )
} 