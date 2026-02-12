import { CircleOpenArrowRight } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { LINKS } from "@/constants/links";
import Link from "next/link";
import React from "react";

const Mission = () => {
  return (
    <div className="flex flex-col items-center gap-6 border-b border-dashed px-6 py-16 text-center sm:py-20">
      <span className="jetbrains-mono text-primary bg-primary/10 rounded-full border border-primary/20 px-4 py-1.5 text-xs font-medium tracking-tight">
        Our Mission
      </span>
      <h3 className="instrument-serif max-w-lg text-3xl sm:text-4xl">
        Make invoice creation simple, free, and privacy focused.
      </h3>
      <p className="jetbrains-mono text-muted-foreground max-w-md text-xs leading-relaxed tracking-tight">
        We believe every freelancer, small business, and creator deserves
        professional invoicing tools without paywalls or data exploitation.
        Invoicely is built by Imoogle Technology to empower you.
      </p>
      <Link href={LINKS.CREATE.INVOICE}>
        <Button variant="secondary" size="lg">
          <span>Start Creating</span>
          <CircleOpenArrowRight className="text-muted-foreground -rotate-45" />
        </Button>
      </Link>
    </div>
  );
};

export default Mission;
