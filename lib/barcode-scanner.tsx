/**
 * MASS Car Workshop - Barcode Scanner
 * 
 * Scan parts barcodes for quick POS checkout
 * Uses browser camera API with barcode detection
 */

"use client"

import { useEffect, useRef, useState, useCallback } from 'react'

export interface ScanResult {
  code: string
  format: string
  timestamp: Date
}

interface BarcodeScannerProps {
  onScan: (result: ScanResult) => void
  onError?: (error: string) => void
  active?: boolean
}

export function useBarcodeDScanner() {
  const [scanning, setScanning] = useState(false)
  const [lastScan, setLastScan] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startScanning = useCallback(async () => {
    try {
      setError(null)
      
      // Check for BarcodeDetector API support
      if (!('BarcodeDetector' in window)) {
        setError('Barcode scanning not supported in this browser. Try Chrome or Edge.')
        return false
      }

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      streamRef.current = stream
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      
      setScanning(true)
      return true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Camera access denied'
      setError(message)
      return false
    }
  }, [])

  const stopScanning = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setScanning(false)
  }, [])

  // Barcode detection loop
  useEffect(() => {
    if (!scanning || !videoRef.current) return

    let animationId: number
    let detector: BarcodeDetector

    const detect = async () => {
      if (!videoRef.current || !scanning) return

      try {
        // @ts-expect-error BarcodeDetector is not in TypeScript types yet
        if (!detector && 'BarcodeDetector' in window) {
          // @ts-expect-error BarcodeDetector constructor
          detector = new BarcodeDetector({
            formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'qr_code', 'upc_a', 'upc_e']
          })
        }

        const barcodes = await detector.detect(videoRef.current)
        
        if (barcodes.length > 0) {
          const result: ScanResult = {
            code: barcodes[0].rawValue,
            format: barcodes[0].format,
            timestamp: new Date()
          }
          setLastScan(result)
          
          // Brief pause to prevent duplicate scans
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch {
        // Detection error, continue trying
      }

      if (scanning) {
        animationId = requestAnimationFrame(detect)
      }
    }

    detect()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [scanning])

  return {
    videoRef,
    scanning,
    lastScan,
    error,
    startScanning,
    stopScanning,
  }
}

// Manual barcode input component for browsers without BarcodeDetector
export function ManualBarcodeInput({ 
  onSubmit 
}: { 
  onSubmit: (code: string) => void 
}) {
  const [code, setCode] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (code.trim()) {
      onSubmit(code.trim())
      setCode('')
      inputRef.current?.focus()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        ref={inputRef}
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter barcode or scan..."
        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        autoFocus
      />
      <button
        type="submit"
        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
      >
        Add
      </button>
    </form>
  )
}

// Lookup part by barcode
export function lookupPartByBarcode(barcode: string, inventory: Array<{ partNumber: string; name: string; price: number; stock: number }>) {
  // Match by part number or generate from barcode
  const part = inventory.find(p => 
    p.partNumber === barcode || 
    p.partNumber.replace(/-/g, '') === barcode
  )
  
  return part || null
}

// Generate barcode for part
export function generatePartBarcode(partNumber: string): string {
  // Simple EAN-13 style barcode generation
  const cleaned = partNumber.replace(/\D/g, '').padStart(12, '0').slice(0, 12)
  
  // Calculate check digit
  let sum = 0
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cleaned[i]) * (i % 2 === 0 ? 1 : 3)
  }
  const checkDigit = (10 - (sum % 10)) % 10
  
  return cleaned + checkDigit
}

// TypeScript declarations for BarcodeDetector
declare global {
  interface BarcodeDetector {
    detect(image: ImageBitmapSource): Promise<DetectedBarcode[]>
  }
  
  interface DetectedBarcode {
    boundingBox: DOMRectReadOnly
    rawValue: string
    format: string
    cornerPoints: Array<{ x: number; y: number }>
  }
  
  // eslint-disable-next-line no-var
  var BarcodeDetector: {
    new(options?: { formats: string[] }): BarcodeDetector
    getSupportedFormats(): Promise<string[]>
  }
}
