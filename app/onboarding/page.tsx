"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload, CheckCircle, X, FileText, Video, Music, Check,
  ArrowRight, ShieldCheck, CreditCard, Calculator, Lock, Loader2
} from "lucide-react";
import clsx from "clsx";
import { setupCompanyProfile, getOrCreateCompanyId } from "@/services/chatApi";

type DecisionType = { id: string; label: string; description: string; };
type UploadedFile = { id: string; name: string; size: number; type: string; file: File; };
type DataSource = { id: string; name: string; icon: React.ElementType; status: "connected" | "pending" | "disconnected" };

const DECISION_TYPES: DecisionType[] = [
  { id: "liquidity", label: "Liquidity & Runway", description: "Cash flow, burn rate forecasting, runway management" },
  { id: "capital", label: "Capital Allocation", description: "CapEx budgeting, ROI analysis, major investments" },
  { id: "pricing", label: "Pricing & Margin", description: "Pricing strategy, gross margin optimization, COGS" },
  { id: "fundraising", label: "Fundraising & M&A", description: "Valuation models, equity dilution, acquisitions" },
  { id: "working_capital", label: "Working Capital", description: "Accounts payable/receivable, debt restructuring" },
  { id: "hiring_budget", label: "Headcount Planning", description: "Payroll impact, compensation structures, hiring ROI" },
];

const DATA_SOURCES: DataSource[] = [
  { id: "stripe", name: "Stripe", icon: CreditCard, status: "disconnected" },
  { id: "quickbooks", name: "QuickBooks", icon: Calculator, status: "disconnected" },
];

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            "transition-all duration-500 rounded-full h-1.5",
            i === current ? "w-8 bg-purple-500" : "w-1.5",
            i < current ? "bg-purple-500/50" : "bg-white/10"
          )}
        />
      ))}
    </div>
  );
}

function FileIcon({ type }: { type: string }) {
  if (type.startsWith("video/")) return <Video size={14} className="text-sky-400" />;
  if (type.startsWith("audio/")) return <Music size={14} className="text-purple-400" />;
  return <FileText size={14} className="text-zinc-300" />;
}

const Card = ({ children, isActive }: { children: React.ReactNode; isActive: boolean }) => (
  <div
    className={clsx(
      "w-full max-w-2xl rounded-[32px] p-8 md:p-12 transition-all duration-700 ease-in-out transform",
      "bg-[#121212] border border-white/5 shadow-[0_24px_80px_rgba(0,0,0,0.5)]",
      isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none hidden"
    )}
  >
    {children}
  </div>
);

export default function OnboardingPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [selectedDecisions, setSelectedDecisions] = useState<string[]>([]);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [connectedDBs, setConnectedDBs] = useState<string[]>([]);
  
  const [dragOver, setDragOver] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [saving, setSaving] = useState(false);

  const [activeIntegration, setActiveIntegration] = useState<DataSource | null>(null);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [apiError, setApiError] = useState("");

  const goNext = async () => {
    if (step === 0 && !companyName.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);

    if (step < 4) {
      setStep(step + 1);
      return;
    }

    await finishOnboarding();
  };

  const goBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const skip = async () => {
    if (step < 4) {
      setStep(step + 1);
      return;
    }
    await finishOnboarding();
  };

  const finishOnboarding = async () => {
    setSaving(true);
    const company_id = getOrCreateCompanyId();

    localStorage.setItem("onboarding_completed", "true");
    localStorage.setItem("company_id", company_id);
    localStorage.setItem("company_name", companyName);
    localStorage.setItem("company_industry", industry);
    localStorage.setItem("company_size", companySize);
    localStorage.setItem("decision_types", JSON.stringify(selectedDecisions));

    try {
      await setupCompanyProfile({
        company_id,
        company_name: companyName,
        industry,
        company_size: companySize,
        decision_types: selectedDecisions,
      });

      if (files.length > 0) {
        const formData = new FormData();
        formData.append("company_id", company_id);
        
        files.forEach((f) => {
          formData.append("files", f.file);
        });

        const uploadRes = await fetch("http://localhost:8000/finance/upload", {
          method: "POST",
          body: formData, 
        });

        if (!uploadRes.ok) {
          console.error("File upload failed, but proceeding to dashboard.");
        }
      }

    } catch (err) {
      console.warn("Profile save failed (non-fatal):", err);
    } finally {
      setSaving(false);
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("think-ai-new"));
      }
      
      router.push("/dashboard"); 
    }
  };

  const toggleDecision = (id: string) => {
    setSelectedDecisions((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleConnectIntegration = async () => {
    if (!apiKeyInput.trim() || !activeIntegration) return;
    
    setIsSyncing(true);
    setApiError(""); 
    const company_id = getOrCreateCompanyId();

    try {
      const res = await fetch("http://localhost:8000/finance/connectors/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          company_id: company_id,
          provider: activeIntegration.id,
          api_key: apiKeyInput
        })
      });

      if (!res.ok) {
        throw new Error("Invalid API Key");
      }

      fetch("http://localhost:8000/finance/sync/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: company_id })
      }).catch(e => console.warn("Sync endpoint error", e));

      await new Promise((resolve) => setTimeout(resolve, 2000));

      setConnectedDBs((prev) => [...prev, activeIntegration.id]);
      setActiveIntegration(null);
      setApiKeyInput("");

    } catch (error) {
      console.error("Connection failed:", error);
      setApiError("Authentication failed. Please verify your API key is correct.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newFiles: UploadedFile[] = Array.from(fileList).map((f) => ({
      id: crypto.randomUUID(),
      name: f.name,
      size: f.size,
      type: f.type,
      file: f,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id));

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden bg-[#0A0A0A]">
      
      {activeIntegration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md p-8 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => !isSyncing && setActiveIntegration(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                <activeIntegration.icon size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Connect {activeIntegration.name}</h3>
                <p className="text-[13px] text-zinc-400">Secure API Key Authentication</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-[12px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">
                  Restricted API Key
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="password"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={activeIntegration.id === "stripe" ? "sk_live_... or sk_test_..." : "Enter integration token"}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/10 text-white text-[14px] focus:ring-2 focus:ring-purple-500/50 outline-none"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 mt-2">
                  Keys are AES-256 encrypted at rest. We only request read-only access.
                </p>
              </div>
            </div>

            {apiError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[12px] flex items-center gap-2">
                <X size={14} /> {apiError}
              </div>
            )}

            <button
              onClick={handleConnectIntegration}
              disabled={isSyncing || !apiKeyInput.trim()}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-white text-black font-bold disabled:opacity-50 transition-all hover:bg-zinc-200"
            >
              {isSyncing ? (
                <><Loader2 size={18} className="animate-spin" /> Syncing Historical Data...</>
              ) : (
                <>Authenticate & Connect</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ENTERPRISE BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg" style={{ opacity: 0.05 }}>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] bg-purple-500/10" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] bg-blue-500/10" />
      </div>

      <div className="relative z-10 flex flex-col items-center mb-10 mt-6">
        <StepDots current={step} total={5} />
      </div>

      {/* STEP 1: WORKSPACE */}
      <Card isActive={step === 0}>
        <div className="mb-8 text-center">
          <h2 className="text-[28px] font-bold tracking-tight text-white mb-2">Configure Workspace</h2>
          <p className="text-[14px] text-zinc-400">Establish the baseline context for the decision engine.</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">
              Company Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => { setCompanyName(e.target.value); setNameError(false); }}
              placeholder="e.g. Acme Corp"
              autoFocus
              className={clsx(
                "w-full px-5 py-4 rounded-xl text-[15px] outline-none transition-all bg-[#1A1A1A] text-white placeholder:text-zinc-600 focus:ring-2",
                nameError ? "border-rose-500/50 focus:ring-rose-500/20" : "border-white/5 focus:border-purple-500/50 focus:ring-purple-500/20 border"
              )}
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">
              Industry Sector
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-5 py-4 rounded-xl text-[15px] outline-none transition-all bg-[#1A1A1A] border border-white/5 text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 appearance-none"
            >
              <option value="" className="text-zinc-600">Select industry...</option>
              {["Technology", "Finance", "Healthcare", "Retail", "Manufacturing", "Education", "Real Estate", "Media", "Other"].map((i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">
              Company Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {["1–50", "51–200", "201–500", "500–1k", "1k–5k", "5k+"].map((size) => (
                <button
                  key={size}
                  onClick={() => setCompanySize(size)}
                  className={clsx(
                    "py-3 rounded-xl text-[13px] font-semibold transition-all border",
                    companySize === size 
                      ? "bg-purple-500/10 border-purple-500/50 text-purple-400" 
                      : "bg-[#1A1A1A] border-white/5 text-zinc-400 hover:border-white/20"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* STEP 2: FRAMEWORKS */}
      <Card isActive={step === 1}>
        <div className="mb-8 text-center">
          <h2 className="text-[28px] font-bold tracking-tight text-white mb-2">Financial Frameworks</h2>
          <p className="text-[14px] text-zinc-400">Select the strategic areas the engine will analyze.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {DECISION_TYPES.map((dt) => {
            const active = selectedDecisions.includes(dt.id);
            return (
              <button
                key={dt.id}
                onClick={() => toggleDecision(dt.id)}
                className={clsx(
                  "relative text-left p-5 rounded-2xl transition-all border",
                  active 
                    ? "bg-purple-500/5 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]" 
                    : "bg-[#1A1A1A] border-white/5 hover:border-white/20"
                )}
              >
                {active && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}
                <p className={clsx("text-[14px] font-bold mb-1", active ? "text-white" : "text-zinc-300")}>{dt.label}</p>
                <p className="text-[12px] text-zinc-500 leading-snug pr-4">{dt.description}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* STEP 3: DATA INTEGRATIONS */}
      <Card isActive={step === 2}>
        <div className="mb-8 text-center">
          <h2 className="text-[28px] font-bold tracking-tight text-white mb-2">Connect Live Data</h2>
          <p className="text-[14px] text-zinc-400">Grant the engine read-only access to your financials.</p>
        </div>

        <div className="space-y-3 mb-4">
          {DATA_SOURCES.map((db) => {
            const isConnected = connectedDBs.includes(db.id);
            return (
              <div key={db.id} className="flex items-center justify-between p-4 rounded-xl bg-[#1A1A1A] border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                    <db.icon size={18} className="text-zinc-300" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-white">{db.name}</p>
                    <p className="text-[12px] text-zinc-500">{isConnected ? "Connected & Syncing" : "Not connected"}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (isConnected) {
                      setConnectedDBs(prev => prev.filter(id => id !== db.id));
                    } else {
                      setApiError("");
                      setApiKeyInput("");
                      setActiveIntegration(db);
                    }
                  }}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-[12px] font-bold transition-all",
                    isConnected 
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:text-rose-300" 
                      : "bg-white text-black hover:bg-zinc-200"
                  )}
                >
                  {isConnected ? "Disconnect" : "Connect"}
                </button>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 justify-center text-[12px] text-zinc-500">
          <ShieldCheck size={14} className="text-emerald-500" /> Enterprise-grade SOC2 encryption. Read-only access.
        </div>
      </Card>

      {/* STEP 4: FILES */}
      <Card isActive={step === 3}>
        <div className="mb-8 text-center">
          <h2 className="text-[28px] font-bold tracking-tight text-white mb-2">Upload Financial Context</h2>
          <p className="text-[14px] text-zinc-400">Drop your CSV exports, cap tables, and financial models here.</p>
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          className={clsx(
            "rounded-2xl p-10 text-center cursor-pointer transition-all mb-4 border-2 border-dashed",
            dragOver ? "bg-purple-500/10 border-purple-500/50" : "bg-[#1A1A1A] border-white/10 hover:border-white/20"
          )}
        >
          <Upload size={28} className="mx-auto mb-3 text-zinc-500" />
          <p className="text-[14px] font-bold text-white mb-1">Drop CSVs & Models here</p>
          <p className="text-[12px] text-zinc-500">CSV, XLSX, PDF — up to 500MB per file</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept=".pdf,.doc,.docx,.mp3,.mp4,.mov,.wav,.xlsx,.csv"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {files.length > 0 && (
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 scrollbar-thin">
            {files.map((f) => (
              <div key={f.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1A1A1A] border border-white/5">
                <FileIcon type={f.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-white truncate">{f.name}</p>
                  <p className="text-[11px] text-zinc-500">{formatSize(f.size)}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); removeFile(f.id); }} className="p-1 hover:bg-white/10 rounded-md">
                  <X size={14} className="text-zinc-500" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* STEP 5: READY */}
      <Card isActive={step === 4}>
        <div className="text-center py-8">
          <h2 className="text-[32px] font-bold tracking-tight text-white mb-2">
            {companyName ? `${companyName} is initialized.` : "Workspace Ready."}
          </h2>
          <p className="text-[15px] mb-10 max-w-sm mx-auto text-zinc-400">
            Three AI is configured and ready to execute recursive financial reasoning.
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center">
            {companyName && <span className="px-3 py-1.5 rounded-lg text-[12px] font-bold bg-[#1A1A1A] border border-white/10 text-white">{companyName}</span>}
            {industry && <span className="px-3 py-1.5 rounded-lg text-[12px] font-bold bg-[#1A1A1A] border border-white/10 text-white">{industry}</span>}
            {connectedDBs.length > 0 && <span className="px-3 py-1.5 rounded-lg text-[12px] font-bold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">{connectedDBs.length} Data sources</span>}
            {files.length > 0 && <span className="px-3 py-1.5 rounded-lg text-[12px] font-bold bg-[#1A1A1A] border border-white/10 text-white">{files.length} Files indexed</span>}
          </div>
        </div>
      </Card>

      {/* NAVIGATION CONTROLS */}
      <div className="relative z-10 mt-8 flex items-center gap-3 w-full max-w-2xl px-2">
        {step > 0 && (
          <button
            onClick={goBack}
            className="px-6 py-4 rounded-xl text-[14px] font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Back
          </button>
        )}
        
        {step < 4 && step !== 0 && (
          <button
            onClick={skip}
            className="px-6 py-4 rounded-xl text-[14px] font-bold text-zinc-500 hover:text-zinc-300 transition-all ml-auto"
          >
            Skip for now
          </button>
        )}

        <button
          onClick={goNext}
          disabled={saving}
          className={clsx(
            "flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-[14px] font-bold transition-all ml-auto",
            step === 0 && !companyName ? "bg-white/10 text-zinc-500 cursor-not-allowed" : "bg-white text-black hover:bg-zinc-200"
          )}
        >
          {saving ? (
            <>Processing...</>
          ) : step === 4 ? (
            <><CheckCircle size={16} /> Launch Workspace</>
          ) : (
            <>Continue <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </div>
  );
}