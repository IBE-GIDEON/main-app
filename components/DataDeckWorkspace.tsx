"use client";

import {
  ChangeEvent,
  DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import {
  Copy,
  Database,
  Download,
  FileText,
  FolderOpen,
  KeyRound,
  Loader2,
  LockKeyhole,
  RefreshCcw,
  Shield,
  Trash2,
  Upload,
} from "lucide-react";

import {
  deleteUploadedFinancialDocument,
  downloadUploadedFinancialDocument,
  getOrCreateCompanyId,
  getUploadedFinancialDocument,
  listUploadedFinancialDocuments,
  uploadFinancialDocuments,
} from "@/services/chatApi";
import type {
  UploadedDocumentDetailResponse,
  UploadedDocumentSummary,
} from "@/types/chat";

type PasscodeMode = "create" | "confirm" | "unlock";

const PASSCODE_LENGTH = 4;

function getPasscodeKey(companyId: string) {
  return `three_ai_data_deck_passcode_${companyId}`;
}

function formatTimestamp(value?: string | null) {
  if (!value) return "Not yet updated";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not yet updated";

  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatBytes(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB"];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size < 10 && unitIndex > 0 ? size.toFixed(1) : Math.round(size)} ${units[unitIndex]}`;
}

function getFileBadge(filename: string) {
  const segments = filename.split(".");
  if (segments.length === 1) return "FILE";
  return segments[segments.length - 1].slice(0, 4).toUpperCase();
}

async function hashPasscode(passcode: string) {
  const payload = new TextEncoder().encode(passcode);
  const buffer = await crypto.subtle.digest("SHA-256", payload);
  return Array.from(new Uint8Array(buffer))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

function PasscodeGateModal({
  isOpen,
  mode,
  value,
  busy,
  error,
  companyName,
  onChange,
  onStartOver,
}: {
  isOpen: boolean;
  mode: PasscodeMode;
  value: string;
  busy: boolean;
  error: string;
  companyName: string;
  onChange: (nextValue: string) => void;
  onStartOver: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const timeoutId = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 60);

    return () => window.clearTimeout(timeoutId);
  }, [isOpen, mode]);

  if (typeof document === "undefined" || !isOpen) return null;

  const title =
    mode === "create"
      ? "Create your Data deck passcode"
      : mode === "confirm"
        ? "Confirm your passcode"
        : "Unlock Data deck";
  const subtitle =
    mode === "create"
      ? `Set a 4-digit code for ${companyName}. You will use it each time you re-enter this workspace.`
      : mode === "confirm"
        ? "Re-enter the same 4 digits so the vault lock is saved."
        : "Enter your 4-digit code to open the manual data vault.";

  return createPortal(
    <div className="fixed inset-0 z-[150]">
      <div className="absolute inset-0 bg-zinc-950/60 backdrop-blur-md" />

      <div className="relative flex min-h-full items-center justify-center px-4 py-8 sm:px-6">
        <div
          role="dialog"
          aria-modal="true"
          className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.28)] dark:border-white/10 dark:bg-[#111111] dark:shadow-[0_32px_120px_rgba(0,0,0,0.52)]"
        >
          <div className="border-b border-zinc-100 px-6 py-5 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-white/10 dark:bg-white/5 dark:text-zinc-100">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-400 dark:text-zinc-500">
                  Secure Entry
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {title}
                </h2>
              </div>
            </div>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          </div>

          <div className="px-6 py-8">
            <div
              className="relative"
              onClick={() => inputRef.current?.focus()}
            >
              <input
                ref={inputRef}
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="one-time-code"
                value={value}
                onChange={(event) =>
                  onChange(event.target.value.replace(/\D/g, "").slice(0, PASSCODE_LENGTH))
                }
                className="absolute inset-0 h-full w-full opacity-0"
                aria-label={title}
              />

              <div className="flex items-center justify-center gap-4">
                {Array.from({ length: PASSCODE_LENGTH }).map((_, index) => {
                  const filled = index < value.length;
                  return (
                    <div
                      key={index}
                      className={clsx(
                        "flex h-16 w-16 items-center justify-center rounded-full border transition-all sm:h-20 sm:w-20",
                        filled
                          ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                          : "border-zinc-200 bg-zinc-50 text-zinc-300 dark:border-zinc-800 dark:bg-[#191919] dark:text-zinc-700",
                      )}
                    >
                      <span className={clsx("h-3 w-3 rounded-full", filled ? "bg-current" : "bg-current/25")} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Numeric only
                </>
              )}
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-300">
                {error}
              </div>
            ) : null}

            <div className="mt-6 flex flex-col items-center gap-3 text-center text-sm text-zinc-500 dark:text-zinc-400">
              <p>The vault locks again whenever you leave this page.</p>
              {mode === "confirm" ? (
                <button
                  type="button"
                  onClick={onStartOver}
                  className="text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
                >
                  Start over
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default function DataDeckWorkspace() {
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(false);
  const [companyId, setCompanyId] = useState("");
  const [companyName, setCompanyName] = useState("your workspace");

  const [passcodeMode, setPasscodeMode] = useState<PasscodeMode>("unlock");
  const [passcodeValue, setPasscodeValue] = useState("");
  const [pendingPasscode, setPendingPasscode] = useState("");
  const [passcodeError, setPasscodeError] = useState("");
  const [verifyingPasscode, setVerifyingPasscode] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const [documents, setDocuments] = useState<UploadedDocumentSummary[]>([]);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<UploadedDocumentDetailResponse | null>(null);
  const [loadingDeck, setLoadingDeck] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [deletingDocumentId, setDeletingDocumentId] = useState<string | null>(null);
  const [copying, setCopying] = useState(false);
  const [workspaceError, setWorkspaceError] = useState("");
  const [workspaceNotice, setWorkspaceNotice] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [totalContextChars, setTotalContextChars] = useState(0);

  useEffect(() => {
    setMounted(true);

    const nextCompanyId = getOrCreateCompanyId();
    setCompanyId(nextCompanyId);
    setCompanyName(localStorage.getItem("company_name") || "your workspace");

    const hasStoredPasscode = Boolean(localStorage.getItem(getPasscodeKey(nextCompanyId)));
    setPasscodeMode(hasStoredPasscode ? "unlock" : "create");
  }, []);

  useEffect(() => {
    if (!mounted || !companyId || passcodeValue.length !== PASSCODE_LENGTH || verifyingPasscode) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void (async () => {
        setVerifyingPasscode(true);
        setPasscodeError("");

        try {
          if (passcodeMode === "create") {
            setPendingPasscode(passcodeValue);
            setPasscodeValue("");
            setPasscodeMode("confirm");
            return;
          }

          if (passcodeMode === "confirm") {
            if (passcodeValue !== pendingPasscode) {
              setPendingPasscode("");
              setPasscodeValue("");
              setPasscodeMode("create");
              setPasscodeError("Those digits did not match. Try again.");
              return;
            }

            const hashed = await hashPasscode(passcodeValue);
            localStorage.setItem(getPasscodeKey(companyId), hashed);
            setPendingPasscode("");
            setPasscodeValue("");
            setIsUnlocked(true);
            setWorkspaceNotice("Data deck unlocked.");
            return;
          }

          const storedHash = localStorage.getItem(getPasscodeKey(companyId));
          if (!storedHash) {
            setPasscodeMode("create");
            setPasscodeValue("");
            return;
          }

          const hashed = await hashPasscode(passcodeValue);
          if (hashed !== storedHash) {
            setPasscodeValue("");
            setPasscodeError("Incorrect passcode. Please try again.");
            return;
          }

          setPasscodeValue("");
          setIsUnlocked(true);
          setWorkspaceNotice("Data deck unlocked.");
        } finally {
          setVerifyingPasscode(false);
        }
      })();
    }, 120);

    return () => window.clearTimeout(timeoutId);
  }, [
    companyId,
    mounted,
    passcodeMode,
    passcodeValue,
    pendingPasscode,
    verifyingPasscode,
  ]);

  useEffect(() => {
    if (!mounted || !companyId || !isUnlocked) return;

    let cancelled = false;

    void (async () => {
      setLoadingDeck(true);
      setWorkspaceError("");

      try {
        const response = await listUploadedFinancialDocuments({ companyId });
        if (cancelled) return;

        setDocuments(response.documents);
        setLastUpdated(response.uploaded_utc || null);
        setTotalContextChars(response.total_chars);
        setSelectedDocumentId((current) => {
          if (current && response.documents.some((document) => document.document_id === current)) {
            return current;
          }
          return response.documents[0]?.document_id ?? null;
        });
      } catch (error) {
        if (!cancelled) {
          setWorkspaceError(
            error instanceof Error ? error.message : "Unable to load the Data deck right now.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingDeck(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [companyId, isUnlocked, mounted]);

  useEffect(() => {
    if (!mounted || !companyId || !isUnlocked || !selectedDocumentId) {
      if (!selectedDocumentId) {
        setSelectedDocument(null);
      }
      return;
    }

    let cancelled = false;

    void (async () => {
      setLoadingDetail(true);
      setWorkspaceError("");

      try {
        const detail = await getUploadedFinancialDocument(selectedDocumentId, companyId);
        if (!cancelled) {
          setSelectedDocument(detail);
        }
      } catch (error) {
        if (!cancelled) {
          setWorkspaceError(
            error instanceof Error ? error.message : "Unable to load this document.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingDetail(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [companyId, isUnlocked, mounted, selectedDocumentId]);

  async function refreshDeck() {
    if (!companyId) return;

    setRefreshing(true);
    setWorkspaceError("");

    try {
      const response = await listUploadedFinancialDocuments({ companyId });
      setDocuments(response.documents);
      setLastUpdated(response.uploaded_utc || null);
      setTotalContextChars(response.total_chars);

      const nextSelected =
        selectedDocumentId && response.documents.some((document) => document.document_id === selectedDocumentId)
          ? selectedDocumentId
          : response.documents[0]?.document_id ?? null;

      setSelectedDocumentId(nextSelected);
      if (!nextSelected) {
        setSelectedDocument(null);
      }
    } catch (error) {
      setWorkspaceError(
        error instanceof Error ? error.message : "Unable to refresh the Data deck.",
      );
    } finally {
      setRefreshing(false);
    }
  }

  async function handleFilesUpload(nextFiles: File[]) {
    if (nextFiles.length === 0) return;

    setUploading(true);
    setWorkspaceError("");
    setWorkspaceNotice("");

    try {
      const response = await uploadFinancialDocuments(nextFiles);
      setDocuments(response.documents);
      setLastUpdated(response.uploaded_utc || null);
      setTotalContextChars(response.total_chars);
      setSelectedDocumentId(response.documents[0]?.document_id ?? null);
      setSelectedDocument(null);
      setWorkspaceNotice(response.message);
    } catch (error) {
      setWorkspaceError(
        error instanceof Error ? error.message : "Unable to upload those files.",
      );
    } finally {
      setUploading(false);
      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
    }
  }

  function handleInputUpload(event: ChangeEvent<HTMLInputElement>) {
    const nextFiles = Array.from(event.target.files ?? []);
    void handleFilesUpload(nextFiles);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    const nextFiles = Array.from(event.dataTransfer.files ?? []);
    void handleFilesUpload(nextFiles);
  }

  async function handleDeleteSelected() {
    if (!companyId || !selectedDocumentId) return;

    const confirmed = window.confirm("Delete this uploaded manual document from the Data deck?");
    if (!confirmed) return;

    setDeletingDocumentId(selectedDocumentId);
    setWorkspaceError("");
    setWorkspaceNotice("");

    try {
      const response = await deleteUploadedFinancialDocument(selectedDocumentId, companyId);
      setDocuments(response.documents);
      setLastUpdated(response.uploaded_utc || null);
      setTotalContextChars(response.total_chars);
      setSelectedDocumentId(response.documents[0]?.document_id ?? null);
      setSelectedDocument(null);
      setWorkspaceNotice(response.message);
    } catch (error) {
      setWorkspaceError(
        error instanceof Error ? error.message : "Unable to delete this document.",
      );
    } finally {
      setDeletingDocumentId(null);
    }
  }

  async function handleDownloadSelected() {
    if (!companyId || !selectedDocumentId) return;

    try {
      const result = await downloadUploadedFinancialDocument(selectedDocumentId, companyId);
      const downloadUrl = window.URL.createObjectURL(result.blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = result.filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      setWorkspaceError(
        error instanceof Error ? error.message : "Unable to download this document.",
      );
    }
  }

  async function handleCopySelected() {
    if (!selectedDocument?.extracted_text) return;

    setCopying(true);
    setWorkspaceError("");

    try {
      await navigator.clipboard.writeText(selectedDocument.extracted_text);
      setWorkspaceNotice("Extracted text copied to your clipboard.");
    } catch {
      setWorkspaceError("Clipboard access was blocked. Try again.");
    } finally {
      setCopying(false);
    }
  }

  const totalPages = documents.reduce((total, document) => total + (document.pages || 0), 0);
  const totalBytes = documents.reduce((total, document) => total + (document.size_bytes || 0), 0);

  return (
    <>
      <main className="flex-1 overflow-y-auto bg-[#F3EFE6] text-zinc-900 dark:bg-[#0A0A0A] dark:text-zinc-100">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <header className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-[#141414] dark:shadow-none">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:border-zinc-800 dark:bg-[#101010] dark:text-zinc-400">
                  <Database className="h-4 w-4" />
                  Data deck
                </div>
                <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                  Secure manual data vault for {companyName}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-base">
                  Files uploaded during onboarding and every later manual upload live here as a reusable AI source. Open them, review the extracted text, download originals, and keep the company context fresh.
                </p>
              </div>

              <div className="grid min-w-[240px] gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-[#101010]">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <Shield className="h-4 w-4" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                      Passcode lock
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    4-digit unlock required every time you come back to this page.
                  </p>
                </div>

                <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-[#101010]">
                  <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <FolderOpen className="h-4 w-4" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                      AI-ready source
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                    Everything here is part of the manual context the backend can use during decisions.
                  </p>
                </div>
              </div>
            </div>
          </header>

          {workspaceError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/10 dark:text-rose-300">
              {workspaceError}
            </div>
          ) : null}

          {workspaceNotice ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-300">
              {workspaceNotice}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <section className="space-y-6">
              <div className="rounded-[24px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141414]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                      Upload Manual Data
                    </p>
                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                      Add more source files
                    </h2>
                  </div>
                  {uploading ? <Loader2 className="h-5 w-5 animate-spin text-zinc-500" /> : null}
                </div>

                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={clsx(
                    "mt-5 rounded-[22px] border border-dashed p-5 transition-colors",
                    dragging
                      ? "border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-900"
                      : "border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-[#101010]",
                  )}
                >
                  <div className="flex flex-col items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-[#171717] dark:text-zinc-200">
                      <Upload className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        Drop files here or add them manually
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        PDFs, CSVs, JSON exports, notes, and onboarding uploads all feed the same manual data source.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => uploadInputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                      >
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        Upload files
                      </button>
                      <button
                        type="button"
                        onClick={() => void refreshDeck()}
                        disabled={refreshing || loadingDeck}
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      >
                        {refreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                        Refresh
                      </button>
                    </div>
                    <input
                      ref={uploadInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleInputUpload}
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#141414]">
                <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                        Stored Files
                      </p>
                      <h2 className="mt-2 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Uploaded manual data
                      </h2>
                    </div>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      {documents.length} file{documents.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                <div className="max-h-[560px] overflow-y-auto p-3">
                  {loadingDeck ? (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-28 animate-pulse rounded-2xl bg-zinc-100 dark:bg-[#101010]"
                        />
                      ))}
                    </div>
                  ) : documents.length > 0 ? (
                    <div className="space-y-3">
                      {documents.map((document) => {
                        const isSelected = document.document_id === selectedDocumentId;
                        return (
                          <button
                            key={document.document_id}
                            type="button"
                            onClick={() => setSelectedDocumentId(document.document_id)}
                            className={clsx(
                              "w-full rounded-[20px] border p-4 text-left transition-colors",
                              isSelected
                                ? "border-zinc-900 bg-zinc-100 dark:border-zinc-100 dark:bg-zinc-900"
                                : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-[#101010] dark:hover:bg-[#171717]",
                            )}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:border-zinc-700 dark:bg-[#151515] dark:text-zinc-300">
                                    {getFileBadge(document.filename)}
                                  </span>
                                  <span className="text-xs text-zinc-400 dark:text-zinc-500">
                                    {formatTimestamp(document.uploaded_utc)}
                                  </span>
                                </div>
                                <p className="mt-3 line-clamp-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                  {document.filename}
                                </p>
                                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                  {document.preview_text || "No extractable text preview yet."}
                                </p>
                              </div>

                              <div className="shrink-0 text-right">
                                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                  {formatBytes(document.size_bytes)}
                                </p>
                                <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                                  {document.pages > 0 ? `${document.pages} page${document.pages === 1 ? "" : "s"}` : "Text"}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-4 py-10 text-center">
                      <FileText className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-500" />
                      <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                        No manual uploads yet
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                        Upload files here and they will show up in this deck. Anything added during onboarding will also appear automatically.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
            <section className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-[22px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141414]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    Files stored
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {documents.length}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Manual uploads available to the AI.
                  </p>
                </div>

                <div className="rounded-[22px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141414]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    Context size
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {totalContextChars.toLocaleString()}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    Extracted characters currently available in the shared deck context.
                  </p>
                </div>

                <div className="rounded-[22px] border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-[#141414]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                    Volume
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {formatBytes(totalBytes)}
                  </p>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                    {totalPages} page{totalPages === 1 ? "" : "s"} of uploaded material, last updated {formatTimestamp(lastUpdated)}.
                  </p>
                </div>
              </div>

              <div className="rounded-[24px] border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-[#141414]">
                <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                        Document Reader
                      </p>
                      <h2 className="mt-2 text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                        {selectedDocument?.document.filename || "Choose a document"}
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void handleCopySelected()}
                        disabled={!selectedDocument || copying}
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      >
                        {copying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
                        Copy text
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDownloadSelected()}
                        disabled={!selectedDocument}
                        className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteSelected()}
                        disabled={!selectedDocument || deletingDocumentId === selectedDocumentId}
                        className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/40 dark:text-rose-300 dark:hover:bg-rose-900/10"
                      >
                        {deletingDocumentId === selectedDocumentId ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>

                  {selectedDocument ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-[#101010] dark:text-zinc-300">
                        {getFileBadge(selectedDocument.document.filename)}
                      </span>
                      <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-[#101010] dark:text-zinc-300">
                        {formatBytes(selectedDocument.document.size_bytes)}
                      </span>
                      <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-[#101010] dark:text-zinc-300">
                        {selectedDocument.document.chars_extracted.toLocaleString()} characters
                      </span>
                      <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-800 dark:bg-[#101010] dark:text-zinc-300">
                        Uploaded {formatTimestamp(selectedDocument.document.uploaded_utc)}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="min-h-[540px] p-5">
                  {loadingDetail ? (
                    <div className="space-y-3">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <div
                          key={index}
                          className="h-6 animate-pulse rounded bg-zinc-100 dark:bg-[#101010]"
                        />
                      ))}
                    </div>
                  ) : selectedDocument ? (
                    <div className="rounded-[22px] border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-[#101010]">
                      <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-[13px] leading-6 text-zinc-700 dark:text-zinc-300">
                        {selectedDocument.extracted_text || "No readable text was extracted from this file yet."}
                      </pre>
                    </div>
                  ) : (
                    <div className="flex min-h-[500px] items-center justify-center rounded-[22px] border border-dashed border-zinc-200 bg-zinc-50 px-6 text-center dark:border-zinc-800 dark:bg-[#101010]">
                      <div className="max-w-lg">
                        <Database className="mx-auto h-8 w-8 text-zinc-400 dark:text-zinc-500" />
                        <h3 className="mt-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
                          Open a file to inspect it
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                          Select any uploaded manual file from the left to read the extracted content, download the original, or remove it from the shared AI context.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <PasscodeGateModal
        isOpen={mounted && !isUnlocked}
        mode={passcodeMode}
        value={passcodeValue}
        busy={verifyingPasscode}
        error={passcodeError}
        companyName={companyName}
        onChange={(nextValue) => {
          setPasscodeError("");
          setPasscodeValue(nextValue);
        }}
        onStartOver={() => {
          setPendingPasscode("");
          setPasscodeValue("");
          setPasscodeError("");
          setPasscodeMode("create");
        }}
      />
    </>
  );
}
