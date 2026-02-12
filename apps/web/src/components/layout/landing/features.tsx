import { ModernCardDescription, ModernCardTitle } from "@/components/ui/modern-card";
import React from "react";

const features = [
  {
    title: "Beautiful Templates",
    description:
      "Professionally designed and visually appealing invoices that increase the chances of clients paying promptly.",
    label: "Design",
  },
  {
    title: "Free & Unlimited",
    description:
      "Create and send as many invoices as you need — no limits, no hidden costs, just seamless billing freedom.",
    label: "Pricing",
  },
  {
    title: "Safe & Secure",
    description:
      "Your data stays yours — we never track, sell, or share it. Store everything locally or securely on our server.",
    label: "Privacy",
  },
];

const Features = () => {
  return (
    <div className="grid grid-flow-row sm:grid-cols-3">
      {features.map((feature, idx) => (
        <div
          key={feature.title}
          className={`flex flex-col gap-3 border-b border-dashed p-6 ${idx > 0 ? "sm:border-l" : ""}`}
        >
          <ModernCardTitle label={feature.label}>{feature.title}</ModernCardTitle>
          <ModernCardDescription>{feature.description}</ModernCardDescription>
        </div>
      ))}
    </div>
  );
};

export default Features;
