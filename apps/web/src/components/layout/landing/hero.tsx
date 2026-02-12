"use client";

import { CircleOpenArrowRight } from "@/assets/icons";
import { PostHogAnalytics } from "@/components/ui/posthog-analytics";
import { Button } from "@/components/ui/button";
import { LINKS } from "@/constants/links";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div className="relative flex min-h-[calc(100svh-64px-150px)] flex-col items-center justify-center overflow-hidden border-b border-dashed py-16 sm:py-24">
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Image
          className="h-full min-h-full w-full object-cover object-left invert dark:invert-0"
          src="/official/invoicely-masked-background.png"
          alt="Hero background"
          width={1920}
          height={1080}
        />
      </div>
      <div className="z-10 flex max-w-2xl flex-col items-center gap-6 px-6 text-center">
        <div className="flex flex-row items-center gap-3">
          <div className="bg-primary/10 flex h-7 items-center rounded-full border border-primary/20 px-4">
            <span className="jetbrains-mono text-primary text-xs font-medium tracking-tight">Free Forever</span>
          </div>
          <div className="bg-muted/40 h-1 w-1 rounded-full"></div>
          <div className="bg-primary/10 flex h-7 items-center rounded-full border border-primary/20 px-4">
            <span className="jetbrains-mono text-primary text-xs font-medium tracking-tight">Privacy Focused</span>
          </div>
        </div>
        <div className="instrument-serif flex flex-col gap-1 text-5xl sm:text-7xl">
          <h1 className="text-balance dark:text-primary-foreground/30 text-secondary-foreground/50">
            Create <span className="dark:text-primary-foreground text-secondary-foreground">Beautiful</span> Invoices
          </h1>
          <h2 className="text-balance dark:text-primary-foreground/30 text-secondary-foreground/50">
            Not <span className="dark:text-primary-foreground text-secondary-foreground">Ugly</span> Ones
          </h2>
        </div>
        <p className="jetbrains-mono text-muted-foreground max-w-md text-xs leading-relaxed tracking-tight">
          Generate professional invoices in seconds. Simple, free, and built with your privacy in mind.
          No sign-up required.
        </p>
        <div className="mt-2 flex flex-row gap-3">
          <Link href={LINKS.CREATE.INVOICE}>
            <Button size="lg">
              <span>Get Started</span>
              <CircleOpenArrowRight className="-rotate-45" />
            </Button>
          </Link>
          <PostHogAnalytics
            analytics={{
              name: "learn-more-click",
              group: "landing-page",
            }}
          >
            <Link href={LINKS.ABOUT}>
              <Button variant="secondary" size="lg">
                <span>Learn More</span>
                <CircleOpenArrowRight className="text-muted-foreground -rotate-45" />
              </Button>
            </Link>
          </PostHogAnalytics>
        </div>
      </div>
    </div>
  );
};

export default Hero;
