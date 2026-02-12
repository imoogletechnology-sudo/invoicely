import { PdfTemplateName } from "@/app/(dashboard)/create/invoice/invoiceHelpers/invoice-templates";
import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { DefaultPDF, MinimalPDF, ProfessionalPDF, ModernPDF } from "@/components/pdf";
import { pdf } from "@react-pdf/renderer";

interface CreatePdfBlobProps {
  template: PdfTemplateName;
  invoiceData: ZodCreateInvoiceSchema;
}

export const createPdfBlob = async ({ invoiceData, template }: CreatePdfBlobProps) => {
  const Template = getPdfTemplate(template);

  const pdfDocument = <Template data={invoiceData} />;
  const blob = await pdf(pdfDocument).toBlob();

  return blob;
};

const getPdfTemplate = (template: CreatePdfBlobProps["template"]) => {
  if (!template) {
    return DefaultPDF;
  }

  switch (template) {
    case "minimal":
      return MinimalPDF;
    case "professional":
      return ProfessionalPDF;
    case "modern":
      return ModernPDF;
    default:
      return DefaultPDF;
  }
};
