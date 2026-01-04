"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Shield, 
  Smartphone, 
  Key,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

export default function SecuritySettingsPage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [showSetupDialog, setShowSetupDialog] = useState(false);
  const [setupStep, setSetupStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState(false);

  // Mock QR code data (in production, generate from server)
  const mockSecretKey = "JBSWY3DPEHPK3PXP";
  const mockQRCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/MASS%20Workshop:user@example.com?secret=${mockSecretKey}&issuer=MASS%20Workshop`;

  const generateBackupCodes = () => {
    const codes = Array(8).fill(0).map(() => 
      Math.random().toString(36).substring(2, 6).toUpperCase() + "-" +
      Math.random().toString(36).substring(2, 6).toUpperCase()
    );
    setBackupCodes(codes);
  };

  const handleEnable2FA = () => {
    setShowSetupDialog(true);
    setSetupStep(1);
    generateBackupCodes();
  };

  const handleVerify = () => {
    // In production, verify with server
    if (verificationCode.length === 6) {
      setSetupStep(2);
    }
  };

  const handleComplete = () => {
    setIs2FAEnabled(true);
    setShowSetupDialog(false);
    setSetupStep(1);
    setVerificationCode("");
  };

  const handleDisable2FA = () => {
    if (confirm("Are you sure you want to disable 2FA? This will reduce your account security.")) {
      setIs2FAEnabled(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Security Settings
        </h1>
        <p className="text-gray-500">Manage your account security</p>
      </div>

      {/* 2FA Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900">
                <Shield className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </div>
            </div>
            <Badge variant={is2FAEnabled ? "default" : "secondary"}>
              {is2FAEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Two-factor authentication adds an additional layer of security by requiring 
            a verification code from your authenticator app when signing in.
          </p>

          {is2FAEnabled ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <Check className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-800 dark:text-green-200">
                    2FA is active
                  </p>
                  <p className="text-sm text-green-600">
                    Your account is protected with authenticator app verification
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => generateBackupCodes()}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate Backup Codes
                </Button>
                <Button variant="destructive" onClick={handleDisable2FA}>
                  Disable 2FA
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={handleEnable2FA} className="bg-emerald-600 hover:bg-emerald-700">
              <Smartphone className="w-4 h-4 mr-2" />
              Enable 2FA
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Password Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
              <Key className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your account password</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button variant="outline">Change Password</Button>
        </CardContent>
      </Card>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage devices where your account is signed in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-gray-500">
                  macOS • Safari • Hargeisa, Somaliland
                </p>
              </div>
              <Badge variant="outline" className="text-green-600">Active Now</Badge>
            </div>
            <Button variant="outline" className="text-red-600 hover:text-red-700">
              Sign Out All Other Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 2FA Setup Dialog */}
      <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {setupStep === 1 ? "Set Up 2FA" : "Save Backup Codes"}
            </DialogTitle>
          </DialogHeader>
          
          {setupStep === 1 ? (
            <div className="space-y-6 pt-4">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Scan this QR code with your authenticator app
                </p>
                <img
                  src={mockQRCodeUrl}
                  alt="2FA QR Code"
                  className="w-48 h-48 mx-auto border rounded-lg p-2"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm text-gray-500">
                  Or enter this key manually:
                </Label>
                <div className="flex gap-2">
                  <Input value={mockSecretKey} readOnly className="font-mono text-center" />
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(mockSecretKey)}
                  >
                    {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Enter verification code from app</Label>
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000"
                  className="text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                />
              </div>

              <Button
                onClick={handleVerify}
                disabled={verificationCode.length !== 6}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                Verify & Continue
              </Button>
            </div>
          ) : (
            <div className="space-y-6 pt-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  Save these backup codes in a secure place. You can use them to access 
                  your account if you lose your authenticator device.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {backupCodes.map((code, idx) => (
                  <div
                    key={idx}
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded font-mono text-sm text-center"
                  >
                    {code}
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => copyToClipboard(backupCodes.join("\n"))}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy All Codes
              </Button>

              <Button
                onClick={handleComplete}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                I've Saved My Codes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
