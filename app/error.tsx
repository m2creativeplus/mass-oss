"use client"

import { useEffect } from "react"
import { AlertTriangle, RefreshCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-950 p-4">
        <Card className="w-full max-w-md border-zinc-800 bg-zinc-900 shadow-2xl">
            <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <CardTitle className="text-xl font-bold text-white">System Malfunction</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <p className="mb-2 text-zinc-400">
                    The workshop system encountered an unexpected error.
                </p>
                {/* Only show error details in development if needed, or hide for prod */}
                <div className="rounded-md bg-zinc-950 p-4 font-mono text-xs text-red-400">
                    {error.message || "Unknown Error"}
                </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
                <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/'}
                    className="border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800"
                >
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                </Button>
                <Button 
                    onClick={() => reset()}
                    className="bg-amber-500 text-black hover:bg-amber-600"
                >
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Reboot Module
                </Button>
            </CardFooter>
        </Card>
    </div>
  )
}
