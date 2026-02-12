"use client";

import { useState, useEffect } from "react";
import { X, Smartphone, Zap, WifiOff } from "lucide-react";
import LogoIcon from "@/components/assets/logo-icon";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
      setTimeout(() => setShowBanner(true), 2000);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Auto-expand after 1s of showing
  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => setIsExpanded(true), 800);
      return () => clearTimeout(timer);
    }
  }, [showBanner]);

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
    setIsExpanded(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-700 sm:left-auto sm:right-6">
      <div className="bg-background relative overflow-hidden rounded-xl border shadow-2xl">
        {/* Accent gradient top line */}
        <div className="from-primary via-primary/70 to-primary/40 h-1 w-full bg-gradient-to-r" />

        <div className="relative p-4">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground absolute top-3 right-3 rounded-md p-1 transition-colors"
            aria-label="Dismiss install prompt"
          >
            <X className="size-3.5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex shrink-0 items-center justify-center rounded-lg border border-primary/20 p-2">
              <LogoIcon className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5 pr-6">
              <p className="text-sm font-semibold leading-tight">Get the Invoicely App</p>
              <p className="text-muted-foreground text-xs leading-tight">
                Install for a faster, native-like experience
              </p>
            </div>
          </div>

          {/* Expanded features */}
          {isExpanded && (
            <div className="mt-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="bg-muted/50 flex flex-col gap-2 rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  <Zap className="text-primary size-3.5 shrink-0" />
                  <span className="text-muted-foreground text-xs">Lightning fast launch from your home screen</span>
                </div>
                <div className="flex items-center gap-2">
                  <Smartphone className="text-primary size-3.5 shrink-0" />
                  <span className="text-muted-foreground text-xs">Full-screen app experience, no browser UI</span>
                </div>
                <div className="flex items-center gap-2">
                  <WifiOff className="text-primary size-3.5 shrink-0" />
                  <span className="text-muted-foreground text-xs">Create invoices even with poor connection</span>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="h-9 flex-1 text-xs font-semibold"
                >
                  Install App
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-muted-foreground h-9 text-xs"
                >
                  Not now
                </Button>
              </div>
            </div>
          )}

          {/* Collapsed CTA */}
          {!isExpanded && (
            <div className="mt-3">
              <Button
                size="sm"
                onClick={handleInstall}
                className="h-8 w-full text-xs font-semibold"
              >
                Install App
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
