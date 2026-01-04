/**
 * Notification Service - Email and SMS
 * Supports multiple providers: SendGrid, Resend for Email; Twilio, Africa's Talking for SMS
 */

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface SMSPayload {
  to: string;
  message: string;
  from?: string;
}

export interface NotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// ============ EMAIL SERVICES ============

/**
 * Send email via SendGrid
 */
export async function sendEmailViaSendGrid(payload: EmailPayload): Promise<NotificationResult> {
  const apiKey = process.env.SENDGRID_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: "SendGrid API key not configured" };
  }

  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: payload.to }] }],
        from: { email: payload.from || process.env.SENDGRID_FROM_EMAIL || "noreply@massworkshop.com" },
        subject: payload.subject,
        content: [
          { type: "text/plain", value: payload.text || payload.html.replace(/<[^>]*>/g, "") },
          { type: "text/html", value: payload.html },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error };
    }

    return { 
      success: true, 
      messageId: response.headers.get("x-message-id") || "sent" 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Send email via Resend
 */
export async function sendEmailViaResend(payload: EmailPayload): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    return { success: false, error: "Resend API key not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: payload.from || process.env.RESEND_FROM_EMAIL || "MASS Workshop <noreply@massworkshop.com>",
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
        text: payload.text,
        reply_to: payload.replyTo,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "Email failed" };
    }

    return { success: true, messageId: data.id };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============ SMS SERVICES ============

/**
 * Send SMS via Twilio
 */
export async function sendSMSViaTwilio(payload: SMSPayload): Promise<NotificationResult> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  
  if (!accountSid || !authToken || !fromNumber) {
    return { success: false, error: "Twilio credentials not configured" };
  }

  try {
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${auth}`,
        },
        body: new URLSearchParams({
          To: payload.to,
          From: payload.from || fromNumber,
          Body: payload.message,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.message || "SMS failed" };
    }

    return { success: true, messageId: data.sid };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Send SMS via Africa's Talking (East Africa focused)
 */
export async function sendSMSViaAfricasTalking(payload: SMSPayload): Promise<NotificationResult> {
  const apiKey = process.env.AFRICASTALKING_API_KEY;
  const username = process.env.AFRICASTALKING_USERNAME;
  const senderId = process.env.AFRICASTALKING_SENDER_ID;
  
  if (!apiKey || !username) {
    return { success: false, error: "Africa's Talking credentials not configured" };
  }

  try {
    const response = await fetch("https://api.africastalking.com/version1/messaging", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
        apiKey,
      },
      body: new URLSearchParams({
        username,
        to: payload.to,
        message: payload.message,
        ...(senderId && { from: senderId }),
      }),
    });

    const data = await response.json();

    if (!response.ok || data.SMSMessageData?.Recipients?.[0]?.status !== "Success") {
      return { 
        success: false, 
        error: data.SMSMessageData?.Recipients?.[0]?.status || "SMS failed" 
      };
    }

    return { 
      success: true, 
      messageId: data.SMSMessageData?.Recipients?.[0]?.messageId 
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ============ UNIFIED NOTIFICATION SERVICE ============

export type EmailProvider = "sendgrid" | "resend";
export type SMSProvider = "twilio" | "africastalking";

/**
 * Send email using configured provider
 */
export async function sendEmail(
  payload: EmailPayload, 
  provider?: EmailProvider
): Promise<NotificationResult> {
  const selectedProvider = provider || process.env.EMAIL_PROVIDER as EmailProvider || "resend";
  
  switch (selectedProvider) {
    case "sendgrid":
      return sendEmailViaSendGrid(payload);
    case "resend":
    default:
      return sendEmailViaResend(payload);
  }
}

/**
 * Send SMS using configured provider
 */
export async function sendSMS(
  payload: SMSPayload, 
  provider?: SMSProvider
): Promise<NotificationResult> {
  const selectedProvider = provider || process.env.SMS_PROVIDER as SMSProvider || "twilio";
  
  switch (selectedProvider) {
    case "africastalking":
      return sendSMSViaAfricasTalking(payload);
    case "twilio":
    default:
      return sendSMSViaTwilio(payload);
  }
}

// ============ TEMPLATE RENDERING ============

/**
 * Render a template with variable substitution
 */
export function renderTemplate(
  template: string, 
  variables: Record<string, string>
): string {
  let rendered = template;
  
  for (const [key, value] of Object.entries(variables)) {
    rendered = rendered.replace(new RegExp(`{{${key}}}`, "g"), value);
  }
  
  return rendered;
}

/**
 * Common notification templates
 */
export const NOTIFICATION_TEMPLATES = {
  appointment_reminder: {
    subject: "Reminder: Your Appointment at MASS Workshop",
    html: `
      <h2>Appointment Reminder</h2>
      <p>Hello {{customer_name}},</p>
      <p>This is a reminder for your upcoming appointment:</p>
      <ul>
        <li><strong>Date:</strong> {{appointment_date}}</li>
        <li><strong>Time:</strong> {{appointment_time}}</li>
        <li><strong>Vehicle:</strong> {{vehicle}}</li>
        <li><strong>Service:</strong> {{service}}</li>
      </ul>
      <p>See you soon!</p>
      <p>— MASS Workshop Team</p>
    `,
    sms: "Hi {{customer_name}}, reminder: Your appointment at MASS Workshop is on {{appointment_date}} at {{appointment_time}} for {{vehicle}}."
  },
  
  invoice_sent: {
    subject: "Invoice #{{invoice_number}} from MASS Workshop",
    html: `
      <h2>Invoice Ready</h2>
      <p>Hello {{customer_name}},</p>
      <p>Your invoice is ready for review.</p>
      <ul>
        <li><strong>Invoice #:</strong> {{invoice_number}}</li>
        <li><strong>Amount:</strong> {{amount}}</li>
        <li><strong>Due Date:</strong> {{due_date}}</li>
      </ul>
      <p><a href="{{invoice_link}}">View Invoice</a></p>
      <p>— MASS Workshop Team</p>
    `,
    sms: "Invoice #{{invoice_number}} for {{amount}} is ready. View at: {{invoice_link}}"
  },
  
  work_order_complete: {
    subject: "Your Vehicle is Ready! - MASS Workshop",
    html: `
      <h2>Work Complete!</h2>
      <p>Hello {{customer_name}},</p>
      <p>Great news! Your vehicle is ready for pickup.</p>
      <ul>
        <li><strong>Vehicle:</strong> {{vehicle}}</li>
        <li><strong>Work Order:</strong> {{work_order_number}}</li>
        <li><strong>Total:</strong> {{total}}</li>
      </ul>
      <p>Please call us at {{workshop_phone}} to schedule pickup.</p>
      <p>— MASS Workshop Team</p>
    `,
    sms: "Hi {{customer_name}}, your {{vehicle}} is ready for pickup! Total: {{total}}. Call {{workshop_phone}} to schedule."
  },
  
  estimate_approval: {
    subject: "Estimate Approval Required - MASS Workshop",
    html: `
      <h2>Estimate Needs Your Approval</h2>
      <p>Hello {{customer_name}},</p>
      <p>We've prepared an estimate for your approval:</p>
      <ul>
        <li><strong>Vehicle:</strong> {{vehicle}}</li>
        <li><strong>Total Estimate:</strong> {{amount}}</li>
      </ul>
      <p><a href="{{approval_link}}">Review & Approve Estimate</a></p>
      <p>— MASS Workshop Team</p>
    `,
    sms: "MASS Workshop: Estimate for {{vehicle}} ({{amount}}) needs your approval. Review at: {{approval_link}}"
  },
};
