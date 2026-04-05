"use client";

import { useState, useCallback, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { verifyPasskey } from "@/services/auth-service";
import type { AuthStatus } from "@/lib/auth-types";

export function PasskeyForm() {
  const [passkey, setPasskey] = useState("");
  const [status, setStatus] = useState<AuthStatus>("idle");
  const router = useRouter();

  const handleSubmit = useCallback(async () => {
    if (!passkey.trim()) return;
    setStatus("loading");

    const ok = await verifyPasskey(passkey);
    if (ok) {
      setStatus("success");
      router.push("/todo");
    } else {
      setStatus("error");
    }
  }, [passkey, router]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-xs space-y-4">
        <div className="space-y-1">
          <h1 className="text-lg font-medium text-foreground">Rushi&apos;s Todo</h1>
          <p className="text-sm text-muted-foreground">
            Enter your passkey to continue
          </p>
        </div>
        <div className="space-y-3">
          <input
            type="password"
            value={passkey}
            onChange={(e) => {
              setPasskey(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Passkey"
            autoFocus
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-colors"
          />
          {status === "error" && (
            <p className="text-sm text-destructive">
              Wrong passkey. Try again.
            </p>
          )}
          <button
            onClick={handleSubmit}
            disabled={status === "loading" || !passkey.trim()}
            className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Verifying..." : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
