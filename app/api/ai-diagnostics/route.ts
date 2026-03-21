import { NextResponse } from "next/server"

// ============================================================
// MASS OSS × SAIP — Gemini Automotive Diagnostics Intelligence
// Replaces the static OBD database with live Gemini analysis
// ============================================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY || ""
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

export async function GET() {
  return NextResponse.json({
    engine: "MASS OSS × SAIP Diagnostics Engine v2.0",
    model: "Gemini Flash 2.0",
    coverage: "Hargeisa, Republic of Somaliland",
    calibration: "Hot/dusty climate, unpaved roads, Japanese imports",
    usage: "POST with { symptoms, vehicleInfo, dtcCodes, mileage }",
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { symptoms, vehicleInfo, dtcCodes, mileage, orgId } = body

    if (!symptoms && !dtcCodes) {
      return NextResponse.json({ error: "Provide symptoms or DTC codes" }, { status: 400 })
    }

    if (!GEMINI_API_KEY) {
      // Enhanced static fallback
      return fallbackDiagnostics(body)
    }

    const vehicleContext = vehicleInfo
      ? `Vehicle: ${vehicleInfo.year || ""} ${vehicleInfo.make || ""} ${vehicleInfo.model || ""}, Mileage: ${mileage || "unknown"} km`
      : "Vehicle details not provided"

    const prompt = `You are an expert automotive diagnostic AI for MASS OSS workshop management system in Hargeisa, Republic of Somaliland.

${vehicleContext}
Reported Symptoms: ${symptoms || "None provided"}
DTC Codes: ${dtcCodes?.join(", ") || "None"}

Provide a comprehensive diagnostic assessment calibrated for:
- Hargeisa climate (hot, dusty, high altitude)
- Local driving conditions (unpaved roads, heavy loads)
- Most common vehicles: Toyota Land Cruiser, Hiace, Hilux, Voxy, Corolla, Suzuki Swift
- Available parts market in Somaliland
- Labor rates: Budget $15/hr, Standard $25/hr, Premium $40/hr

Return ONLY valid JSON (no markdown):
{
  "primaryDiagnosis": "Most likely cause",
  "confidence": 85,
  "severity": "medium",
  "estimatedRepairTimeHours": 2.5,
  "laborCostUSD": { "budget": 37.5, "standard": 62.5, "premium": 100 },
  "partsNeeded": [
    { "name": "Part name", "estimatedCostUSD": 45, "availabilityInHargeisa": "readily_available" }
  ],
  "totalEstimateUSD": { "min": 85, "max": 160 },
  "dtcAnalysis": [
    { "code": "P0420", "description": "Catalyst efficiency below threshold", "urgency": "moderate" }
  ],
  "alternativeCauses": ["Other possible cause 1", "Other possible cause 2"],
  "recommendations": ["Immediate action needed", "Check X system", "Replace Y component"],
  "localContext": "Notes specific to Somaliland/Hargeisa conditions",
  "warranty": "Check if vehicle is under any import warranty",
  "nextService": "Recommended next preventive maintenance"
}

severity must be: "critical" | "high" | "medium" | "low"
availability must be: "readily_available" | "order_required" | "rare_in_somaliland"`

    const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
      }),
      signal: AbortSignal.timeout(20000),
    })

    if (!response.ok) {
      const errText = await response.text()
      // Fall back to static if Gemini fails
      return fallbackDiagnostics(body)
    }

    const geminiData = await response.json()
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || ""

    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return fallbackDiagnostics(body)

    const diagnosis = JSON.parse(jsonMatch[0])

    return NextResponse.json({
      ...diagnosis,
      source: "gemini-flash-2.0",
      analyzedAt: new Date().toISOString(),
      market: "Hargeisa, Republic of Somaliland",
      geminiPowered: true,
    })

  } catch (error: any) {
    return NextResponse.json(
      { error: `Diagnostics engine error: ${error.message}` },
      { status: 500 }
    )
  }
}

function fallbackDiagnostics(body: any) {
  const { symptoms = "", dtcCodes = [] } = body
  const sym = symptoms.toLowerCase()

  // Enhanced rule-based fallback
  let diagnosis = {
    primaryDiagnosis: "Requires physical inspection",
    confidence: 45,
    severity: "medium",
    estimatedRepairTimeHours: 1.5,
    laborCostUSD: { budget: 22.5, standard: 37.5, premium: 60 },
    partsNeeded: [] as any[],
    totalEstimateUSD: { min: 25, max: 80 },
    dtcAnalysis: dtcCodes.map((code: string) => ({
      code,
      description: "See OBD scanner for full description",
      urgency: "moderate"
    })),
    alternativeCauses: ["Sensor malfunction", "Wiring issue"],
    recommendations: ["Perform OBD II full scan", "Check all fluid levels", "Inspect air filter (dusty Hargeisa roads)"],
    localContext: "Hargeisa roads contribute to accelerated wear on suspension and air filters.",
    source: "static-fallback",
    geminiPowered: false,
    analyzedAt: new Date().toISOString(),
  }

  if (sym.includes("brake") || sym.includes("stop")) {
    diagnosis.primaryDiagnosis = "Brake system issue — brake pads, fluid, or caliper"
    diagnosis.severity = "high"
    diagnosis.confidence = 72
    diagnosis.recommendations = ["Inspect brake pads immediately", "Check brake fluid level", "Test brake lines for leaks"]
  } else if (sym.includes("engine") || sym.includes("misfire") || sym.includes("rough")) {
    diagnosis.primaryDiagnosis = "Engine misfiring — likely spark plugs, fuel injector, or MAF sensor"
    diagnosis.severity = "medium"
    diagnosis.confidence = 68
    diagnosis.partsNeeded = [{ name: "Spark Plug Set", estimatedCostUSD: 25, availabilityInHargeisa: "readily_available" }]
  } else if (sym.includes("oil") || sym.includes("leak")) {
    diagnosis.primaryDiagnosis = "Oil leak — gasket, seal, or drain plug issue"
    diagnosis.severity = "high"
    diagnosis.confidence = 75
    diagnosis.recommendations = ["Check oil level immediately", "Inspect all gaskets and seals", "Do not drive until repaired"]
  } else if (sym.includes("overheat") || sym.includes("hot") || sym.includes("temperature")) {
    diagnosis.primaryDiagnosis = "Cooling system failure — common in Hargeisa heat (radiator, thermostat, water pump)"
    diagnosis.severity = "critical"
    diagnosis.confidence = 80
    diagnosis.recommendations = ["Stop driving IMMEDIATELY", "Check coolant level", "Inspect radiator for blockage"]
  }

  return NextResponse.json(diagnosis)
}
