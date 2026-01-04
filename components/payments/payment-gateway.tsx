"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Loader2, 
  CheckCircle, 
  XCircle,
  ExternalLink
} from "lucide-react";

type PaymentGateway = "stripe" | "paypal" | "paystack";
type PaymentStatus = "idle" | "processing" | "success" | "error";

interface PaymentGatewayProps {
  amount: number;
  currency?: string;
  invoiceId?: string;
  customerId?: string;
  customerEmail?: string;
  description?: string;
  onSuccess?: (result: PaymentResult) => void;
  onError?: (error: string) => void;
  enabledGateways?: PaymentGateway[];
}

interface PaymentResult {
  gateway: PaymentGateway;
  transactionId: string;
  amount: number;
  currency: string;
  status: string;
}

const GATEWAY_INFO = {
  stripe: {
    name: "Card Payment",
    icon: CreditCard,
    description: "Pay with credit or debit card",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  paypal: {
    name: "PayPal",
    icon: Building2,
    description: "Pay with your PayPal account",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  paystack: {
    name: "Paystack",
    icon: Smartphone,
    description: "Card, Bank Transfer, or Mobile Money",
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
};

export default function PaymentGateway({
  amount,
  currency = "USD",
  invoiceId,
  customerId,
  customerEmail,
  description,
  onSuccess,
  onError,
  enabledGateways = ["stripe", "paypal", "paystack"],
}: PaymentGatewayProps) {
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>(enabledGateways[0]);
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(customerEmail || "");

  const formatCurrency = (amt: number, curr: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: curr,
    }).format(amt);
  };

  const handleStripePayment = async () => {
    setStatus("processing");
    setError(null);

    try {
      const response = await fetch("/api/payments/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          invoiceId,
          customerId,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Stripe payment failed");
      }

      // In a real implementation, you would use Stripe.js to complete the payment
      // For now, we'll show a success message
      // stripe.confirmCardPayment(data.clientSecret, { ... })
      
      setStatus("success");
      onSuccess?.({
        gateway: "stripe",
        transactionId: data.paymentIntentId,
        amount,
        currency,
        status: "pending", // Would be "succeeded" after confirmation
      });
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
      onError?.(err.message);
    }
  };

  const handlePayPalPayment = async () => {
    setStatus("processing");
    setError(null);

    try {
      const response = await fetch("/api/payments/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          invoiceId,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "PayPal payment failed");
      }

      // Redirect to PayPal approval page
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      }
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
      onError?.(err.message);
    }
  };

  const handlePaystackPayment = async () => {
    if (!email) {
      setError("Email is required for Paystack payments");
      return;
    }

    setStatus("processing");
    setError(null);

    try {
      const response = await fetch("/api/payments/paystack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          email,
          invoiceId,
          customerId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Paystack payment failed");
      }

      // Redirect to Paystack payment page
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
      onError?.(err.message);
    }
  };

  const handlePayment = () => {
    switch (selectedGateway) {
      case "stripe":
        handleStripePayment();
        break;
      case "paypal":
        handlePayPalPayment();
        break;
      case "paystack":
        handlePaystackPayment();
        break;
    }
  };

  if (status === "success") {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
            Payment Initiated!
          </h3>
          <p className="text-green-600 dark:text-green-400 mt-2">
            Your payment of {formatCurrency(amount, currency)} is being processed.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Payment</span>
          <Badge variant="secondary" className="text-lg font-bold">
            {formatCurrency(amount, currency)}
          </Badge>
        </CardTitle>
        <CardDescription>
          {description || "Complete your payment securely"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gateway Selection */}
        <Tabs value={selectedGateway} onValueChange={(v) => setSelectedGateway(v as PaymentGateway)}>
          <TabsList className="grid w-full grid-cols-3">
            {enabledGateways.map((gateway) => {
              const info = GATEWAY_INFO[gateway];
              const Icon = info.icon;
              return (
                <TabsTrigger key={gateway} value={gateway} className="gap-1">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{info.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Gateway Details */}
          {enabledGateways.map((gateway) => {
            const info = GATEWAY_INFO[gateway];
            const Icon = info.icon;
            return (
              <TabsContent key={gateway} value={gateway} className="mt-4">
                <div className={`p-4 rounded-lg ${info.color}`}>
                  <div className="flex items-center gap-3">
                    <Icon className="w-8 h-8" />
                    <div>
                      <p className="font-medium">{info.name}</p>
                      <p className="text-sm opacity-80">{info.description}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Email for Paystack */}
        {selectedGateway === "paystack" && (
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <XCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Pay Button */}
        <Button
          onClick={handlePayment}
          disabled={status === "processing"}
          className="w-full h-12 text-lg bg-emerald-600 hover:bg-emerald-700"
        >
          {status === "processing" ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay {formatCurrency(amount, currency)}
              <ExternalLink className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>

        {/* Security Note */}
        <p className="text-xs text-center text-gray-500">
          🔒 Payments are processed securely. We never store your card details.
        </p>
      </CardContent>
    </Card>
  );
}
