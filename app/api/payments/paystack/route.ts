import { NextRequest, NextResponse } from "next/server";

// Paystack API route handler (Africa-focused payment gateway)
// Note: Requires PAYSTACK_SECRET_KEY in environment variables
// Supports: Card, Bank Transfer, USSD, Mobile Money (Ghana, Kenya)
// For Somaliland: Consider local providers like Zaad/eDahab integration

const PAYSTACK_API_BASE = "https://api.paystack.co";

// Initialize a transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      amount, 
      email, 
      currency = "USD", 
      invoiceId, 
      customerId,
      callback_url,
      metadata 
    } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Customer email required" },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack not configured. Add PAYSTACK_SECRET_KEY to environment." },
        { status: 500 }
      );
    }

    const payload = {
      email,
      amount: Math.round(amount * 100), // Paystack expects kobo/cents
      currency: currency.toUpperCase(),
      reference: invoiceId || `pay-${Date.now().toString(36)}`,
      callback_url: callback_url || `${process.env.NEXT_PUBLIC_APP_URL}/payment/verify`,
      metadata: {
        invoiceId,
        customerId,
        source: "MASS Workshop",
        ...metadata,
      },
    };

    const response = await fetch(`${PAYSTACK_API_BASE}/transaction/initialize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${secretKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Failed to initialize transaction");
    }

    return NextResponse.json({
      reference: data.data.reference,
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
    });
  } catch (error: any) {
    console.error("Paystack error:", error);
    return NextResponse.json(
      { error: error.message || "Payment initialization failed" },
      { status: 500 }
    );
  }
}

// Verify a transaction
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Transaction reference required" },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { error: "Paystack not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${PAYSTACK_API_BASE}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      }
    );

    const data = await response.json();

    if (!data.status) {
      throw new Error(data.message || "Verification failed");
    }

    return NextResponse.json({
      status: data.data.status,
      amount: data.data.amount / 100, // Convert back from kobo
      currency: data.data.currency,
      channel: data.data.channel,
      reference: data.data.reference,
      paid_at: data.data.paid_at,
      customer: {
        email: data.data.customer?.email,
        name: data.data.customer?.first_name,
      },
    });
  } catch (error: any) {
    console.error("Paystack verify error:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed" },
      { status: 500 }
    );
  }
}

// Webhook handler
export async function PUT(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    // Verify webhook signature
    const crypto = await import("crypto");
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    switch (event.event) {
      case "charge.success":
        console.log("Paystack payment successful:", event.data.reference);
        // TODO: Update invoice status in Convex
        break;

      case "charge.failed":
        console.log("Paystack payment failed:", event.data.reference);
        break;

      default:
        console.log(`Unhandled Paystack event: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
