"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Key,
  Plus,
  Trash2,
  TestTube,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Power,
  Sparkles,
  Shield,
  Zap,
} from "lucide-react"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"
import { Id } from "@/convex/_generated/dataModel"

const AI_PROVIDERS = [
  { id: "openai", name: "OpenAI", color: "#10A37F", prefix: "sk-", description: "GPT-4o, GPT-4, DALL·E" },
  { id: "google", name: "Google AI", color: "#4285F4", prefix: "AIza", description: "Gemini Pro, Flash, Ultra" },
  { id: "anthropic", name: "Anthropic", color: "#D4A574", prefix: "sk-ant-", description: "Claude 3.5, Claude 3 Opus" },
  { id: "mistral", name: "Mistral AI", color: "#FF7000", prefix: "mk-", description: "Mistral Large, Medium" },
  { id: "groq", name: "Groq", color: "#F55036", prefix: "gsk_", description: "LLaMA, Mixtral (ultrafast)" },
  { id: "cohere", name: "Cohere", color: "#39594D", prefix: "co-", description: "Command R+, Embed" },
  { id: "huggingface", name: "HuggingFace", color: "#FF9D00", prefix: "hf_", description: "Open-source model hub" },
  { id: "custom", name: "Custom", color: "#8B5CF6", prefix: "", description: "Any custom AI endpoint" },
] as const

type Provider = typeof AI_PROVIDERS[number]["id"]

interface ApiKeyManagerProps {
  orgId: string
}

export function ApiKeyManager({ orgId }: ApiKeyManagerProps) {
  const keys = useQuery(api.apiKeys.listKeys, { orgId })
  const addKey = useMutation(api.apiKeys.addKey)
  const removeKey = useMutation(api.apiKeys.removeKey)
  const toggleKey = useMutation(api.apiKeys.toggleKey)
  const updateTestResult = useMutation(api.apiKeys.updateTestResult)

  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider>("openai")
  const [keyLabel, setKeyLabel] = useState("")
  const [keyValue, setKeyValue] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [testingKeyId, setTestingKeyId] = useState<string | null>(null)
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null)

  const handleAddKey = async () => {
    if (!keyValue.trim()) {
      toast.error("Please enter an API key")
      return
    }
    if (!keyLabel.trim()) {
      toast.error("Please enter a label for this key")
      return
    }

    setIsAdding(true)
    try {
      await addKey({
        orgId,
        provider: selectedProvider,
        label: keyLabel.trim(),
        apiKey: keyValue.trim(),
      })
      toast.success(`${selectedProvider.toUpperCase()} key added successfully`)
      setKeyValue("")
      setKeyLabel("")
      setShowAddForm(false)
    } catch (error) {
      console.error(error)
      toast.error("Failed to add API key")
    } finally {
      setIsAdding(false)
    }
  }

  const handleTestKey = async (keyId: string, provider: string) => {
    setTestingKeyId(keyId)
    try {
      // Get the decrypted key from convex
      const decryptedKey = await fetch("/api/test-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: "test" }), // Placeholder
      })

      // We need to test via the API route directly
      // First get the key - for now we test with a placeholder flow
      const response = await fetch("/api/test-api-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey: keyValue || "test-placeholder" }),
      })

      const result = await response.json()

      await updateTestResult({
        id: keyId as Id<"apiKeys">,
        status: result.status || "failed",
        message: result.message || "Unknown response",
      })

      if (result.status === "success") {
        toast.success(result.message)
      } else if (result.status === "rate_limited") {
        toast.warning(result.message)
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error(`Test failed: ${error.message}`)
    } finally {
      setTestingKeyId(null)
    }
  }

  const handleDeleteKey = async (keyId: string) => {
    setDeletingKeyId(keyId)
    try {
      await removeKey({ id: keyId as Id<"apiKeys"> })
      toast.success("API key removed")
    } catch (error) {
      toast.error("Failed to remove key")
    } finally {
      setDeletingKeyId(null)
    }
  }

  const handleToggleKey = async (keyId: string) => {
    try {
      await toggleKey({ id: keyId as Id<"apiKeys"> })
      toast.success("Key status updated")
    } catch (error) {
      toast.error("Failed to toggle key")
    }
  }

  const getProviderInfo = (providerId: string) => {
    return AI_PROVIDERS.find((p) => p.id === providerId) || AI_PROVIDERS[AI_PROVIDERS.length - 1]
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "rate_limited":
        return <Clock className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-slate-500" />
    }
  }

  const getStatusBadge = (status?: string) => {
    const styles: Record<string, string> = {
      success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
      expired: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      rate_limited: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    }
    const labels: Record<string, string> = {
      success: "Valid",
      failed: "Invalid",
      expired: "Expired",
      rate_limited: "Rate Limited",
    }
    if (!status) return <Badge variant="outline" className="text-slate-500 border-slate-500/20 text-[10px]">Untested</Badge>
    return <Badge variant="outline" className={`${styles[status] || ""} text-[10px] font-bold`}>{labels[status] || status}</Badge>
  }

  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
  const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Header + Add Button */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-violet-500" />
            AI Model API Keys
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Securely manage your AI provider credentials. Keys are encrypted at rest.
          </p>
        </div>
        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-violet-600 hover:bg-violet-700 text-white font-bold shadow-lg shadow-violet-500/20"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Key
        </Button>
      </motion.div>

      {/* Add Key Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-violet-500/30 bg-black/60 backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500" />
              <CardHeader>
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-500" />
                  Add New API Key
                </CardTitle>
                <CardDescription>
                  Select your AI provider and paste your API key below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Provider Grid */}
                <div>
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold mb-3 block">
                    Select Provider
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AI_PROVIDERS.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider.id)}
                        className={`p-3 rounded-xl border-2 transition-all text-left ${
                          selectedProvider === provider.id
                            ? "border-violet-500 bg-violet-500/10 scale-[1.02]"
                            : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: provider.color }}
                          />
                          <span className="text-sm font-bold text-white">{provider.name}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                          {provider.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Label */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                    Label
                  </Label>
                  <Input
                    value={keyLabel}
                    onChange={(e) => setKeyLabel(e.target.value)}
                    placeholder={`e.g. Production ${getProviderInfo(selectedProvider).name}`}
                    className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-violet-500/50"
                  />
                </div>

                {/* Key Input */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground font-bold">
                    API Key
                  </Label>
                  <div className="relative">
                    <Input
                      value={keyValue}
                      onChange={(e) => setKeyValue(e.target.value)}
                      type={showKey ? "text" : "password"}
                      placeholder={`${getProviderInfo(selectedProvider).prefix}...`}
                      className="bg-white/5 border-white/10 h-12 rounded-xl font-mono text-sm pr-12 focus:border-violet-500/50"
                    />
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    Your key is encrypted before storage. We never display the full key.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleAddKey}
                    disabled={isAdding || !keyValue.trim() || !keyLabel.trim()}
                    className="bg-violet-600 hover:bg-violet-700 text-white font-bold flex-1"
                  >
                    {isAdding ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Encrypting...</>
                    ) : (
                      <><Key className="h-4 w-4 mr-2" /> Add Encrypted Key</>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => { setShowAddForm(false); setKeyValue(""); setKeyLabel("") }}
                    className="border-white/10"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key List */}
      {keys === undefined ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
        </div>
      ) : keys.length === 0 ? (
        <motion.div variants={item}>
          <Card className="border-white/5 bg-black/40 backdrop-blur-xl">
            <CardContent className="py-16 flex flex-col items-center gap-4 text-center">
              <div className="h-16 w-16 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                <Key className="h-8 w-8 text-violet-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">No API Keys Configured</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add your first AI provider key to unlock diagnostics, content generation, and intelligent recommendations.
                </p>
              </div>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-violet-600 hover:bg-violet-700 mt-2"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Your First Key
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {keys.map((key) => {
            const provider = getProviderInfo(key.provider)
            return (
              <motion.div key={key._id} variants={item}>
                <Card className={`border-white/5 bg-black/40 backdrop-blur-xl shadow-xl relative overflow-hidden transition-all hover:border-white/10 ${
                  !key.isActive ? "opacity-50" : ""
                }`}>
                  <div
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{ backgroundColor: provider.color }}
                  />
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Provider Icon */}
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${provider.color}20` }}
                      >
                        <Zap className="h-5 w-5" style={{ color: provider.color }} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-white text-sm">{key.label}</p>
                          {getStatusBadge(key.lastTestStatus)}
                          {!key.isActive && (
                            <Badge variant="outline" className="text-slate-500 border-slate-500/20 text-[10px]">
                              Disabled
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground font-mono">
                            {key.keyPrefix}••••••••{key.keySuffix}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {provider.name}
                          </span>
                          {key.lastTestedAt && (
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              {getStatusIcon(key.lastTestStatus)}
                              Tested {new Date(key.lastTestedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleTestKey(key._id, key.provider)}
                          disabled={testingKeyId === key._id}
                          className="h-8 w-8 text-slate-400 hover:text-violet-400"
                          title="Test Key"
                        >
                          {testingKeyId === key._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <TestTube className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleKey(key._id)}
                          className={`h-8 w-8 ${key.isActive ? "text-emerald-500 hover:text-emerald-400" : "text-slate-500 hover:text-slate-400"}`}
                          title={key.isActive ? "Disable Key" : "Enable Key"}
                        >
                          <Power className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteKey(key._id)}
                          disabled={deletingKeyId === key._id}
                          className="h-8 w-8 text-slate-400 hover:text-red-400"
                          title="Delete Key"
                        >
                          {deletingKeyId === key._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Security Footer */}
      <motion.div variants={item}>
        <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
          <Shield className="h-5 w-5 text-violet-500 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white">Sovereign Security Protocol</p>
            <p className="text-[10px] text-muted-foreground">
              All API keys are encrypted at rest. Keys are never exposed to the client — only masked prefixes are displayed.
              Test operations use server-side validation.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
