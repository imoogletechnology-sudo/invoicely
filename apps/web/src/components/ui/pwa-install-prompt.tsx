"use client";

import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      // Show again after 7 days
      if (Date.now() - dismissedAt < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Delay showing the banner for a better UX
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md animate-in slide-in-from-bottom-4 fade-in duration-500 sm:left-auto sm:right-6">
      <div className="bg-background flex items-center gap-3 rounded-lg border border-dashed p-3 shadow-lg">
        <div className="bg-primary/10 flex shrink-0 items-center justify-center rounded-md border border-primary/20 p-2">
          <Download className="text-primary size-4" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="text-sm font-medium leading-tight">Install Invoicely</p>
          <p className="text-muted-foreground text-xs leading-tight">
            Add to your home screen for quick access
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button size="sm" onClick={handleInstall} className="h-8 px-3 text-xs">
            Install
          </Button>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground rounded-md p-1 transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
