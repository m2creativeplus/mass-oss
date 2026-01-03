"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { 
  Camera,
  Upload,
  Sparkles,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  FileText,
  DollarSign,
  Clock,
  Image as ImageIcon
} from "lucide-react"
import { analyzePart as aiAnalyzePart } from "@/lib/ai-diagnostics"

interface DiagnosisResult {
  partName: string
  condition: "good" | "fair" | "poor" | "critical"
  issue: string
  recommendation: string
  estimatedCost: number
  urgency: "low" | "medium" | "high"
}

export function AutoDiagnosticsModule() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [additionalNotes, setAdditionalNotes] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setDiagnosis(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzePart = async () => {
    if (!imagePreview) return
    
    setAnalyzing(true)
    setDiagnosis(null)
    
    try {
      // Call real AI analysis
      const result = await aiAnalyzePart({
        imageBase64: imagePreview,
        additionalContext: additionalNotes
      })

      if (result.success) {
        setDiagnosis({
          partName: result.partIdentified,
          condition: result.condition as DiagnosisResult["condition"],
          issue: result.issues[0] || "No major issues detected",
          recommendation: result.recommendations[0] || "No specific recommendations",
          estimatedCost: result.estimatedCost.low,
          urgency: result.urgency as DiagnosisResult["urgency"]
        })
      }
    } catch (error) {
      console.error("Diagnosis error:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  const getConditionBadge = (condition: DiagnosisResult["condition"]) => {
    switch (condition) {
      case "good":
        return <Badge className="bg-emerald-500">Good</Badge>
      case "fair":
        return <Badge className="bg-amber-500">Fair</Badge>
      case "poor":
        return <Badge className="bg-orange-500">Poor</Badge>
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>
    }
  }

  const getUrgencyBadge = (urgency: DiagnosisResult["urgency"]) => {
    switch (urgency) {
      case "low":
        return <Badge variant="outline" className="border-emerald-500 text-emerald-600">Low Priority</Badge>
      case "medium":
        return <Badge variant="outline" className="border-amber-500 text-amber-600">Medium Priority</Badge>
      case "high":
        return <Badge variant="outline" className="border-red-500 text-red-600">High Priority</Badge>
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-500" />
            AI Auto-Diagnostics
          </h2>
          <p className="text-sm text-slate-500">Upload a photo of a part for instant AI analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        
        {/* Left: Upload Area */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="h-5 w-5 text-orange-500" />
                Upload Part Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  imagePreview 
                    ? 'border-orange-300 bg-orange-50 dark:bg-orange-900/10' 
                    : 'border-slate-300 dark:border-slate-700 hover:border-orange-400'
                }`}
              >
                {imagePreview ? (
                  <div className="space-y-4">
                    <img 
                      src={imagePreview} 
                      alt="Uploaded part" 
                      className="max-h-64 mx-auto rounded-lg shadow-lg"
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setImagePreview(null)
                        setDiagnosis(null)
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                    <ImageIcon className="h-16 w-16 mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-600 dark:text-slate-400 mb-2">
                      Drag and drop an image, or click to browse
                    </p>
                    <p className="text-xs text-slate-400">
                      Supports: JPG, PNG, HEIC - Max 10MB
                    </p>
                  </label>
                )}
              </div>

              {/* Additional Notes */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Additional Notes (Optional)
                </label>
                <Textarea 
                  placeholder="E.g., 'Customer reported grinding noise when braking', 'Visible fluid leak'..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Analyze Button */}
              <Button 
                className="w-full mt-4 h-12 bg-orange-500 hover:bg-orange-600 text-white"
                disabled={!imagePreview || analyzing}
                onClick={analyzePart}
              >
                {analyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 mr-2" />
                    Analyze Part
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right: Diagnosis Results */}
        <div className="space-y-4">
          {analyzing && (
            <Card className="bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
              <CardContent className="p-8 text-center">
                <div className="animate-pulse space-y-4">
                  <Sparkles className="h-16 w-16 mx-auto text-orange-500 animate-bounce" />
                  <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
                    AI Analyzing Image...
                  </h3>
                  <p className="text-orange-600 dark:text-orange-300">
                    Using Gemini 3 Pro multimodal vision to identify issues
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {diagnosis && !analyzing && (
            <Card className="border-2 border-orange-200 dark:border-orange-800">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    AI Diagnosis Report
                  </span>
                  {getConditionBadge(diagnosis.condition)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Part Identified */}
                <div>
                  <h4 className="text-sm font-medium text-slate-500 mb-1">Part Identified</h4>
                  <p className="text-xl font-bold text-slate-800 dark:text-white">{diagnosis.partName}</p>
                </div>

                {/* Issue Found */}
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-800 dark:text-red-200 mb-1">Issue Detected</h4>
                      <p className="text-sm text-red-700 dark:text-red-300">{diagnosis.issue}</p>
                    </div>
                  </div>
                </div>

                {/* Recommendation */}
                <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-1">Recommendation</h4>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">{diagnosis.recommendation}</p>
                    </div>
                  </div>
                </div>

                {/* Cost & Urgency */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-sm">Estimated Cost</span>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">${diagnosis.estimatedCost}</p>
                  </div>
                  <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">Urgency</span>
                    </div>
                    <div className="mt-1">{getUrgencyBadge(diagnosis.urgency)}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white">
                    <FileText className="h-4 w-4 mr-2" />
                    Create Estimate
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Add to Work Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {!diagnosis && !analyzing && (
            <Card className="bg-slate-100 dark:bg-slate-800/50 border-dashed">
              <CardContent className="p-12 text-center">
                <Sparkles className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-600 dark:text-slate-400 mb-2">
                  No Analysis Yet
                </h3>
                <p className="text-sm text-slate-400">
                  Upload a photo and click "Analyze Part" to get AI-powered diagnostics
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default AutoDiagnosticsModule
