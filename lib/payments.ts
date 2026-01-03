/**
 * MASS Car Workshop - Zaad & e-Dahab Payment Integration
 * 
 * Somaliland Mobile Money Payment APIs
 * - Zaad (Telesom) - Most popular
 * - e-Dahab (Somtel) - Second largest
 */

export interface PaymentRequest {
  amount: number
  currency: 'USD' | 'SLSH'
  customerPhone: string
  description: string
  invoiceId: string
  merchantId?: string
}

export interface PaymentResponse {
  success: boolean
  transactionId: string
  status: 'pending' | 'completed' | 'failed'
  message: string
  timestamp: string
}

// Zaad Payment (Telesom)
export async function initiateZaadPayment(request: PaymentRequest): Promise<PaymentResponse> {
  const ZAAD_API_URL = process.env.NEXT_PUBLIC_ZAAD_API_URL || 'https://api.zaad.so/v1'
  const ZAAD_MERCHANT_ID = process.env.ZAAD_MERCHANT_ID
  const ZAAD_API_KEY = process.env.ZAAD_API_KEY
  
  // Format phone number (remove country code if present)
  const phone = request.customerPhone.replace(/^\+?252/, '').replace(/\D/g, '')
  
  try {
    const response = await fetch(`${ZAAD_API_URL}/payment/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZAAD_API_KEY}`,
        'X-Merchant-ID': ZAAD_MERCHANT_ID || '',
      },
      body: JSON.stringify({
        amount: request.amount,
        currency: request.currency,
        phone: phone,
        description: request.description,
        reference: request.invoiceId,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/zaad/callback`,
      }),
    })
    
    if (!response.ok) {
      throw new Error(`Zaad API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      success: true,
      transactionId: data.transaction_id,
      status: 'pending',
      message: 'Payment request sent. Customer will receive USSD prompt.',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[Zaad] Payment error:', error)
    
    // Demo mode fallback
    if (!ZAAD_API_KEY) {
      return {
        success: true,
        transactionId: `ZAAD-DEMO-${Date.now()}`,
        status: 'pending',
        message: '🔶 DEMO MODE: Zaad payment simulated. Configure ZAAD_API_KEY for production.',
        timestamp: new Date().toISOString(),
      }
    }
    
    return {
      success: false,
      transactionId: '',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Payment failed',
      timestamp: new Date().toISOString(),
    }
  }
}

// e-Dahab Payment (Somtel)
export async function initiateEDahabPayment(request: PaymentRequest): Promise<PaymentResponse> {
  const EDAHAB_API_URL = process.env.NEXT_PUBLIC_EDAHAB_API_URL || 'https://api.edahab.net/v1'
  const EDAHAB_MERCHANT_ID = process.env.EDAHAB_MERCHANT_ID
  const EDAHAB_API_KEY = process.env.EDAHAB_API_KEY
  
  const phone = request.customerPhone.replace(/^\+?252/, '').replace(/\D/g, '')
  
  try {
    const response = await fetch(`${EDAHAB_API_URL}/payment/request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${EDAHAB_API_KEY}`,
        'Merchant-ID': EDAHAB_MERCHANT_ID || '',
      },
      body: JSON.stringify({
        amount: request.amount,
        currency: request.currency,
        customer_phone: phone,
        description: request.description,
        invoice_id: request.invoiceId,
        webhook_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/edahab/webhook`,
      }),
    })
    
    if (!response.ok) {
      throw new Error(`e-Dahab API error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      success: true,
      transactionId: data.txn_id,
      status: 'pending',
      message: 'e-Dahab payment request initiated.',
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[e-Dahab] Payment error:', error)
    
    // Demo mode fallback
    if (!EDAHAB_API_KEY) {
      return {
        success: true,
        transactionId: `EDAHAB-DEMO-${Date.now()}`,
        status: 'pending',
        message: '🟢 DEMO MODE: e-Dahab payment simulated. Configure EDAHAB_API_KEY for production.',
        timestamp: new Date().toISOString(),
      }
    }
    
    return {
      success: false,
      transactionId: '',
      status: 'failed',
      message: error instanceof Error ? error.message : 'Payment failed',
      timestamp: new Date().toISOString(),
    }
  }
}

// Check payment status
export async function checkPaymentStatus(
  provider: 'zaad' | 'edahab',
  transactionId: string
): Promise<PaymentResponse> {
  // Demo mode
  if (transactionId.includes('DEMO')) {
    return {
      success: true,
      transactionId,
      status: 'completed',
      message: 'DEMO: Payment completed successfully',
      timestamp: new Date().toISOString(),
    }
  }
  
  const API_URL = provider === 'zaad' 
    ? process.env.NEXT_PUBLIC_ZAAD_API_URL 
    : process.env.NEXT_PUBLIC_EDAHAB_API_URL
    
  const API_KEY = provider === 'zaad'
    ? process.env.ZAAD_API_KEY
    : process.env.EDAHAB_API_KEY
  
  try {
    const response = await fetch(`${API_URL}/payment/status/${transactionId}`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    })
    
    const data = await response.json()
    
    return {
      success: data.status === 'completed',
      transactionId,
      status: data.status,
      message: data.message || 'Status retrieved',
      timestamp: new Date().toISOString(),
    }
  } catch {
    return {
      success: false,
      transactionId,
      status: 'pending',
      message: 'Unable to check status',
      timestamp: new Date().toISOString(),
    }
  }
}

// Process payment based on method
export async function processPayment(
  method: 'cash' | 'zaad' | 'edahab' | 'card',
  request: PaymentRequest
): Promise<PaymentResponse> {
  switch (method) {
    case 'zaad':
      return initiateZaadPayment(request)
    case 'edahab':
      return initiateEDahabPayment(request)
    case 'cash':
      return {
        success: true,
        transactionId: `CASH-${Date.now()}`,
        status: 'completed',
        message: 'Cash payment recorded',
        timestamp: new Date().toISOString(),
      }
    case 'card':
      return {
        success: true,
        transactionId: `CARD-${Date.now()}`,
        status: 'pending',
        message: 'Card payment requires POS terminal confirmation',
        timestamp: new Date().toISOString(),
      }
    default:
      return {
        success: false,
        transactionId: '',
        status: 'failed',
        message: 'Unknown payment method',
        timestamp: new Date().toISOString(),
      }
  }
}
