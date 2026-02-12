import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { DefaultPDF, MinimalPDF, ProfessionalPDF, ModernPDF } from "@/components/pdf";
import { FormSelect } from "@/components/ui/form/form-select";
import { SelectItem } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { TriangleIcon, BriefcaseIcon, SparklesIcon } from "lucide-react";
import { BoxIcon } from "@/assets/icons";

export type PdfTemplateName = "default" | "minimal" | "professional" | "modern" | undefined;

interface PdfTemplate {
  name: PdfTemplateName;
  label: string;
  component: React.ComponentType<{ data: ZodCreateInvoiceSchema }>;
  icon: React.ReactNode;
}

// Available Template Array
export const availablePdfTemplates: PdfTemplate[] = [
  {
    name: "default",
    label: "Default",
    component: DefaultPDF,
    icon: <BoxIcon />,
  },
  {
    name: "minimal",
    label: "Minimal",
    component: MinimalPDF,
    icon: <TriangleIcon stroke="none" fill="currentColor" />,
  },
  {
    name: "professional",
    label: "Professional",
    component: ProfessionalPDF,
    icon: <BriefcaseIcon className="size-4" />,
  },
  {
    name: "modern",
    label: "Modern",
    component: ModernPDF,
    icon: <SparklesIcon className="size-4" />,
  },
];

export const InvoiceTemplateSelector = ({ form }: { form: UseFormReturn<ZodCreateInvoiceSchema> }) => {
  return (
    <FormSelect
      name="invoiceDetails.theme.template"
      reactform={form}
      defaultValue="default"
      placeholder="Select template"
      alingContent="end"
      className="min-w-34"
    >
      {availablePdfTemplates.map((template) => {
        // if the template is undefined, don't render it
        if (!template.name) return null;

        return (
          <SelectItem key={template.name} value={template.name}>
            <div className="flex flex-row items-center gap-2">{template.icon}</div>
            <span>{template.label}</span>
          </SelectItem>
        );
      })}
    </FormSelect>
  );
};
