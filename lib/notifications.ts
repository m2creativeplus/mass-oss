/**
 * MASS Car Workshop - SMS & WhatsApp Notifications
 * 
 * Send service reminders, payment confirmations, and delivery notifications
 * Uses Twilio for SMS and WhatsApp
 */

export interface NotificationPayload {
  to: string
  message: string
  type: 'sms' | 'whatsapp'
  templateId?: string
  variables?: Record<string, string>
}

export interface NotificationResult {
  success: boolean
  messageId: string
  status: 'sent' | 'queued' | 'failed'
  error?: string
}

// Pre-defined message templates
export const MessageTemplates = {
  SERVICE_REMINDER: {
    id: 'service_reminder',
    template: `🚗 MASS Workshop Reminder\n\nDear {customerName},\n\nYour {vehicleModel} ({plateNumber}) is due for {serviceType}.\n\n📅 Recommended Date: {dueDate}\n📍 Location: MASS Car Workshop, Hargeisa\n📞 Call: +252-63-4521789\n\nBook now to keep your vehicle in top condition!`
  },
  PAYMENT_CONFIRMATION: {
    id: 'payment_confirmation',
    template: `✅ Payment Received\n\nDear {customerName},\n\nWe received your payment of ${'{amount}'} via {paymentMethod}.\n\n🧾 Invoice: #{invoiceNumber}\n🚗 Vehicle: {vehicleModel}\n\nThank you for choosing MASS Car Workshop!`
  },
  WORK_ORDER_UPDATE: {
    id: 'work_order_update',
    template: `🔧 Service Update\n\nDear {customerName},\n\nYour {vehicleModel} is now: {status}\n\n📝 Work Order: #{workOrderId}\n👨‍🔧 Technician: {technicianName}\n\nWe'll notify you when ready for pickup.`
  },
  VEHICLE_READY: {
    id: 'vehicle_ready',
    template: `🎉 Vehicle Ready!\n\nDear {customerName},\n\nGreat news! Your {vehicleModel} is ready for pickup.\n\n💵 Total Due: ${'{amount}'}\n📍 MASS Car Workshop, Hargeisa\n⏰ Open: 8AM - 6PM\n\nSee you soon!`
  },
  DELIVERY_SCHEDULED: {
    id: 'delivery_scheduled',
    template: `🚚 Delivery Scheduled\n\nDear {customerName},\n\nYour {vehicleModel} delivery is scheduled:\n\n📅 Date: {deliveryDate}\n⏰ Time: {deliveryTime}\n📍 Address: {deliveryAddress}\n🚗 Driver: {driverName}\n\nCall +252-63-4521789 for changes.`
  },
  REGISTRATION_EXPIRY: {
    id: 'registration_expiry',
    template: `⚠️ Registration Expiring\n\nDear {customerName},\n\nYour vehicle registration expires on {expiryDate}.\n\n🚗 {vehicleModel} ({plateNumber})\n\nVisit MASS Car Workshop for renewal assistance.\n📞 +252-63-4521789`
  }
}

// Send SMS via Twilio
async function sendSMS(to: string, message: string): Promise<NotificationResult> {
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
  const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER
  
  // Normalize phone number
  let phone = to.replace(/\D/g, '')
  if (!phone.startsWith('252')) {
    phone = '252' + phone.replace(/^0+/, '')
  }
  phone = '+' + phone
  
  // Demo mode
  if (!TWILIO_ACCOUNT_SID) {
    console.log(`[SMS DEMO] To: ${phone}\n${message}`)
    return {
      success: true,
      messageId: `SMS-DEMO-${Date.now()}`,
      status: 'sent',
    }
  }
  
  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phone,
          From: TWILIO_PHONE_NUMBER || '',
          Body: message,
        }),
      }
    )
    
    const data = await response.json()
    
    if (data.error_code) {
      throw new Error(data.error_message)
    }
    
    return {
      success: true,
      messageId: data.sid,
      status: 'sent',
    }
  } catch (error) {
    return {
      success: false,
      messageId: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'SMS failed',
    }
  }
}

// Send WhatsApp via Twilio
async function sendWhatsApp(to: string, message: string): Promise<NotificationResult> {
  const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
  const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
  const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER
  
  let phone = to.replace(/\D/g, '')
  if (!phone.startsWith('252')) {
    phone = '252' + phone.replace(/^0+/, '')
  }
  
  // Demo mode
  if (!TWILIO_ACCOUNT_SID) {
    console.log(`[WhatsApp DEMO] To: +${phone}\n${message}`)
    return {
      success: true,
      messageId: `WA-DEMO-${Date.now()}`,
      status: 'sent',
    }
  }
  
  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: `whatsapp:+${phone}`,
          From: `whatsapp:${TWILIO_WHATSAPP_NUMBER}`,
          Body: message,
        }),
      }
    )
    
    const data = await response.json()
    
    return {
      success: !data.error_code,
      messageId: data.sid || '',
      status: data.error_code ? 'failed' : 'sent',
      error: data.error_message,
    }
  } catch (error) {
    return {
      success: false,
      messageId: '',
      status: 'failed',
      error: error instanceof Error ? error.message : 'WhatsApp failed',
    }
  }
}

// Render template with variables
function renderTemplate(template: string, variables: Record<string, string>): string {
  let rendered = template
  for (const [key, value] of Object.entries(variables)) {
    rendered = rendered.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
  }
  return rendered
}

// Main send function
export async function sendNotification(payload: NotificationPayload): Promise<NotificationResult> {
  let message = payload.message
  
  // Use template if provided
  if (payload.templateId && payload.variables) {
    const template = Object.values(MessageTemplates).find(t => t.id === payload.templateId)
    if (template) {
      message = renderTemplate(template.template, payload.variables)
    }
  }
  
  if (payload.type === 'whatsapp') {
    return sendWhatsApp(payload.to, message)
  }
  return sendSMS(payload.to, message)
}

// Convenience functions
export async function sendServiceReminder(
  phone: string,
  customerName: string,
  vehicleModel: string,
  plateNumber: string,
  serviceType: string,
  dueDate: string
): Promise<NotificationResult> {
  return sendNotification({
    to: phone,
    message: '',
    type: 'whatsapp', // Prefer WhatsApp for Somaliland
    templateId: 'service_reminder',
    variables: { customerName, vehicleModel, plateNumber, serviceType, dueDate }
  })
}

export async function sendPaymentConfirmation(
  phone: string,
  customerName: string,
  amount: string,
  paymentMethod: string,
  invoiceNumber: string,
  vehicleModel: string
): Promise<NotificationResult> {
  return sendNotification({
    to: phone,
    message: '',
    type: 'sms',
    templateId: 'payment_confirmation',
    variables: { customerName, amount, paymentMethod, invoiceNumber, vehicleModel }
  })
}

export async function sendVehicleReadyNotification(
  phone: string,
  customerName: string,
  vehicleModel: string,
  amount: string
): Promise<NotificationResult> {
  return sendNotification({
    to: phone,
    message: '',
    type: 'whatsapp',
    templateId: 'vehicle_ready',
    variables: { customerName, vehicleModel, amount }
  })
}
