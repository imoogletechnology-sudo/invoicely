import BlogHeader from "@/components/layout/marketing/blogs/blog-header";
import BlogFooter from "@/components/layout/marketing/blogs/blog-footer";
import { CircleOpenArrowRight } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { LINKS } from "@/constants/links";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "About Invoicely | Simple, Free & Privacy-Focused Invoicing",
  description:
    "Invoicely was created to make invoice creation simple and free, with privacy at its core. Built by Imoogle Technology.",
};

const values = [
  {
    title: "Simple by Design",
    description:
      "No complicated setups or lengthy onboarding. Create professional invoices in seconds with an intuitive interface that gets out of your way.",
  },
  {
    title: "Free, No Strings",
    description:
      "Unlimited invoices, unlimited downloads, zero hidden costs. We believe essential business tools should be accessible to everyone.",
  },
  {
    title: "Privacy First",
    description:
      "Your data belongs to you. We never track, sell, or share your information. Store locally or on our secure servers -- your choice.",
  },
  {
    title: "Built for Everyone",
    description:
      "Whether you are a freelancer, small business owner, or creative professional, Invoicely adapts to your invoicing needs.",
  },
];

const Page = () => {
  return (
    <div className="new-container">
      <BlogHeader link={LINKS.HOME} label="Home" />

      {/* Hero */}
      <div className="flex flex-col items-center gap-6 border-b border-dashed px-6 py-16 text-center sm:py-24">
        <span className="jetbrains-mono text-primary bg-primary/10 rounded-full border border-primary/20 px-4 py-1.5 text-xs font-medium tracking-tight">
          About Invoicely
        </span>
        <h1 className="instrument-serif max-w-lg text-4xl sm:text-5xl">
          Invoice creation made simple, free, and private.
        </h1>
        <p className="jetbrains-mono text-muted-foreground max-w-md text-xs leading-relaxed tracking-tight">
          Invoicely was built with a single purpose: to give freelancers, small businesses,
          and creators a beautiful, hassle-free way to create invoices -- without
          paywalls, without data exploitation, without compromise.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2">
        {values.map((value, idx) => (
          <div
            key={value.title}
            className={`flex flex-col gap-3 border-b border-dashed p-6 ${idx % 2 !== 0 ? "sm:border-l" : ""}`}
          >
            <h3 className="jetbrains-mono text-sm font-medium tracking-tight">{value.title}</h3>
            <p className="jetbrains-mono text-muted-foreground text-xs leading-relaxed tracking-tight">
              {value.description}
            </p>
          </div>
        ))}
      </div>

      {/* Built by Imoogle */}
      <div className="flex flex-col items-center gap-4 border-b border-dashed px-6 py-16 text-center">
        <h2 className="instrument-serif text-2xl sm:text-3xl">Built by Imoogle Technology</h2>
        <p className="jetbrains-mono text-muted-foreground max-w-sm text-xs leading-relaxed tracking-tight">
          We are a technology company focused on building tools that empower
          people. Invoicely is our commitment to making professional invoicing
          accessible to all.
        </p>
        <Link href={LINKS.CREATE.INVOICE} className="mt-2">
          <Button size="lg">
            <span>Create Your First Invoice</span>
            <CircleOpenArrowRight className="-rotate-45" />
          </Button>
        </Link>
      </div>

      <BlogFooter />
    </div>
  );
};

export default Page;
