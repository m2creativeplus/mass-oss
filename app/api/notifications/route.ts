import { NextRequest, NextResponse } from "next/server";
import { 
  sendEmail, 
  sendSMS, 
  renderTemplate, 
  NOTIFICATION_TEMPLATES 
} from "@/lib/notifications/notification-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      type, // "email" | "sms"
      templateId, // Key from NOTIFICATION_TEMPLATES
      to,
      subject, // Override for email
      message, // Override for SMS
      variables // Template variables
    } = body;

    if (!type || !to) {
      return NextResponse.json(
        { error: "Missing required fields: type, to" },
        { status: 400 }
      );
    }

    // Get template if using a predefined one
    const template = templateId ? NOTIFICATION_TEMPLATES[templateId as keyof typeof NOTIFICATION_TEMPLATES] : null;

    if (type === "email") {
      let emailSubject = subject;
      let emailHtml = message;

      if (template) {
        emailSubject = renderTemplate(template.subject, variables || {});
        emailHtml = renderTemplate(template.html, variables || {});
      }

      if (!emailSubject || !emailHtml) {
        return NextResponse.json(
          { error: "Email requires subject and html content" },
          { status: 400 }
        );
      }

      const result = await sendEmail({
        to,
        subject: emailSubject,
        html: emailHtml,
      });

      return NextResponse.json(result);
    }

    if (type === "sms") {
      let smsMessage = message;

      if (template && template.sms) {
        smsMessage = renderTemplate(template.sms, variables || {});
      }

      if (!smsMessage) {
        return NextResponse.json(
          { error: "SMS requires message content" },
          { status: 400 }
        );
      }

      const result = await sendSMS({
        to,
        message: smsMessage,
      });

      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: "Invalid notification type. Use 'email' or 'sms'" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send notification" },
      { status: 500 }
    );
  }
}

// Get available notification templates
export async function GET() {
  const templates = Object.keys(NOTIFICATION_TEMPLATES).map((key) => ({
    id: key,
    name: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    hasEmail: true,
    hasSMS: !!(NOTIFICATION_TEMPLATES[key as keyof typeof NOTIFICATION_TEMPLATES] as any).sms,
  }));

  return NextResponse.json({ templates });
}
