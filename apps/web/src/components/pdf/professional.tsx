/* eslint-disable jsx-a11y/alt-text */
"use client";

import { GEIST_FONT, GEIST_MONO_FONT } from "@/constants/pdf-fonts";
import { ZodCreateInvoiceSchema } from "@/zod-schemas/invoice/create-invoice";
import { Document, Page, Text, View, Image, Font } from "@react-pdf/renderer";
import { getSubTotalValue, getTotalValue } from "@/constants/pdf-helpers";
import { formatCurrencyText, getCurrencyDisplayLabel } from "@/constants/currency";
import { createTw } from "react-pdf-tailwind";
import { toWords } from "number-to-words";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import React from "react";

Font.register({
  family: "GeistMono",
  fonts: GEIST_MONO_FONT,
});

Font.register({
  family: "Geist",
  fonts: GEIST_FONT,
});

const tw = createTw({
  theme: {
    fontFamily: {
      default: ["Geist"],
      geistmono: ["GeistMono"],
    },
    extend: {
      colors: {
        accent: "#1a1a2e",
        accentLight: "#16213e",
        accentMuted: "#e8e8ed",
      },
      fontSize: {
        "2xs": "0.625rem",
        "3xs": "0.5rem",
      },
    },
  },
});

const ProfessionalPDF: React.FC<{ data: ZodCreateInvoiceSchema }> = ({ data }) => {
  const subtotal = getSubTotalValue(data);
  const total = getTotalValue(data);
  const baseColor = data.invoiceDetails.theme.baseColor || "#1a1a2e";

  return (
    <Document
      title={`Invoice-${data.invoiceDetails.prefix}${data.invoiceDetails.serialNumber}`}
      author={data.companyDetails.name}
      creator={data.companyDetails.name}
      producer="Invoicely"
    >
      <Page size="A4" style={tw("font-default text-sm text-neutral-800 bg-white")}>
        {/* Top accent bar */}
        <View style={tw(`h-2 bg-[${baseColor}] w-full`)} />

        {/* Header */}
        <View style={tw("flex flex-row justify-between items-start px-8 pt-6 pb-4")}>
          <View style={tw("flex flex-col gap-1")}>
            {data.companyDetails.logo ? (
              <Image
                style={{
                  aspectRatio: 16 / 9,
                  ...tw("w-24 h-14 object-contain object-left"),
                }}
                src={data.companyDetails.logo}
              />
            ) : (
              <Text style={tw(`text-xl font-bold text-[${baseColor}]`)}>{data.companyDetails.name}</Text>
            )}
            <Text style={tw("text-2xs text-neutral-500 mt-1 max-w-[200px]")}>{data.companyDetails.address}</Text>
            {data.companyDetails.metadata.map((metadata) => (
              <View key={metadata.label} style={tw("flex flex-row items-center gap-1")}>
                <Text style={tw("text-2xs font-medium text-neutral-600")}>{metadata.label}:</Text>
                <Text style={tw("text-2xs text-neutral-500")}>{metadata.value}</Text>
              </View>
            ))}
          </View>
          <View style={tw("flex flex-col items-end gap-0.5")}>
            <Text style={tw(`text-3xl font-bold tracking-tight text-[${baseColor}]`)}>INVOICE</Text>
            <Text style={tw("text-xs font-geistmono text-neutral-500 tracking-tight")}>
              {data.invoiceDetails.prefix}{data.invoiceDetails.serialNumber}
            </Text>
          </View>
        </View>

        {/* Divider */}
        <View style={tw(`h-[1px] bg-[${baseColor}] mx-8 opacity-20`)} />

        {/* Invoice Info Row */}
        <View style={tw("flex flex-row justify-between px-8 py-4")}>
          <View style={tw("flex flex-col gap-0.5")}>
            <Text style={tw("text-3xs font-semibold uppercase tracking-wider text-neutral-400")}>Issue Date</Text>
            <Text style={tw("text-xs font-medium")}>{format(data.invoiceDetails.date, "MMM dd, yyyy")}</Text>
          </View>
          {data.invoiceDetails.dueDate && (
            <View style={tw("flex flex-col gap-0.5")}>
              <Text style={tw("text-3xs font-semibold uppercase tracking-wider text-neutral-400")}>Due Date</Text>
              <Text style={tw("text-xs font-medium")}>{format(data.invoiceDetails.dueDate, "MMM dd, yyyy")}</Text>
            </View>
          )}
          <View style={tw("flex flex-col gap-0.5")}>
            <Text style={tw("text-3xs font-semibold uppercase tracking-wider text-neutral-400")}>Currency</Text>
            <Text style={tw("text-xs font-medium")}>{getCurrencyDisplayLabel(data.invoiceDetails.currency)}</Text>
          </View>
          {data.invoiceDetails.paymentTerms ? (
            <View style={tw("flex flex-col gap-0.5")}>
              <Text style={tw("text-3xs font-semibold uppercase tracking-wider text-neutral-400")}>Payment Terms</Text>
              <Text style={tw("text-xs font-medium")}>{data.invoiceDetails.paymentTerms}</Text>
            </View>
          ) : null}
        </View>

        {/* Billing Section */}
        <View style={tw("flex flex-row px-8 py-3 gap-6")}>
          <View style={tw(`flex flex-col gap-1 p-4 w-1/2 rounded-lg bg-neutral-50 border border-neutral-200`)}>
            <Text style={tw(`text-3xs font-semibold uppercase tracking-wider text-[${baseColor}]`)}>From</Text>
            <Text style={tw("text-sm font-semibold mt-1")}>{data.companyDetails.name}</Text>
            <Text style={tw("text-2xs text-neutral-500")}>{data.companyDetails.address}</Text>
          </View>
          <View style={tw(`flex flex-col gap-1 p-4 w-1/2 rounded-lg bg-[${baseColor}] bg-opacity-5`)}>
            <Text style={tw(`text-3xs font-semibold uppercase tracking-wider text-[${baseColor}]`)}>Bill To</Text>
            <Text style={tw("text-sm font-semibold mt-1")}>{data.clientDetails.name}</Text>
            <Text style={tw("text-2xs text-neutral-500")}>{data.clientDetails.address}</Text>
            {data.clientDetails.metadata.map((metadata) => (
              <View key={metadata.label} style={tw("flex flex-row items-center gap-1")}>
                <Text style={tw("text-2xs font-medium text-neutral-600")}>{metadata.label}:</Text>
                <Text style={tw("text-2xs text-neutral-500")}>{metadata.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Items Table */}
        <View style={tw("mx-8 mt-3 grow")}>
          <View
            style={tw(
              cn(
                `flex-row flex items-center px-4 py-2.5 font-semibold text-2xs rounded-t-lg text-white bg-[${baseColor}]`,
              ),
            )}
          >
            <Text style={tw("w-[45%]")}>Description</Text>
            <Text style={tw("w-[12%] text-center")}>Qty</Text>
            <Text style={tw("w-[20%] text-right")}>Unit Price</Text>
            <Text style={tw("w-[23%] text-right")}>Amount</Text>
          </View>
          <View style={tw("flex flex-col")}>
            {data.items.map((item, index) => (
              <View
                key={index}
                style={tw(
                  cn(
                    "flex-row px-4 py-2.5 text-2xs border-b border-neutral-100",
                    index % 2 === 0 ? "bg-white" : "bg-neutral-50",
                  ),
                )}
              >
                <View style={tw("flex flex-col w-[45%]")}>
                  <Text style={tw("text-xs font-medium")}>{item.name}</Text>
                  {item.description ? (
                    <Text style={tw("text-2xs text-neutral-400 mt-0.5")}>{item.description}</Text>
                  ) : null}
                </View>
                <Text style={tw("w-[12%] text-center font-geistmono tracking-tight text-xs")}>{item.quantity}</Text>
                <Text style={tw("w-[20%] text-right font-geistmono tracking-tight text-xs")}>
                  {formatCurrencyText(data.invoiceDetails.currency, item.unitPrice)}
                </Text>
                <Text style={tw("w-[23%] text-right font-geistmono tracking-tight text-xs font-semibold")}>
                  {formatCurrencyText(data.invoiceDetails.currency, item.quantity * item.unitPrice)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer Section */}
        <View style={tw("flex flex-row px-8 pb-6 gap-6")}>
          {/* Left: Payment Info, Terms, Notes */}
          <View style={tw("flex flex-col w-1/2 gap-3 justify-end")}>
            {data.metadata.paymentInformation.length > 0 && (
              <View style={tw("flex flex-col gap-1")}>
                <Text style={tw(`text-3xs font-semibold uppercase tracking-wider text-[${baseColor}]`)}>
                  Payment Information
                </Text>
                {data.metadata.paymentInformation.map((info, index) => (
                  <View key={index} style={tw("flex flex-row items-center gap-1")}>
                    <Text style={tw("text-2xs font-medium text-neutral-600 min-w-[80px]")}>{info.label}</Text>
                    <Text style={tw("text-2xs text-neutral-500")}>{info.value}</Text>
                  </View>
                ))}
              </View>
            )}
            {data.metadata.terms ? (
              <View style={tw("flex flex-col gap-0.5")}>
                <Text style={tw(`text-3xs font-semibold uppercase tracking-wider text-[${baseColor}]`)}>Terms</Text>
                <Text style={tw("text-2xs text-neutral-500")}>{data.metadata.terms}</Text>
              </View>
            ) : null}
            {data.metadata.notes ? (
              <View style={tw("flex flex-col gap-0.5")}>
                <Text style={tw(`text-3xs font-semibold uppercase tracking-wider text-[${baseColor}]`)}>Notes</Text>
                <Text style={tw("text-2xs text-neutral-500")}>{data.metadata.notes}</Text>
              </View>
            ) : null}
          </View>

          {/* Right: Totals */}
          <View style={tw("flex flex-col w-1/2 justify-end")}>
            {/* Signature */}
            {data.companyDetails.signature && (
              <View style={tw("flex flex-col items-end gap-1 mb-3")}>
                <Text style={tw("text-3xs text-neutral-400")}>Authorized Signature</Text>
                <Image
                  style={{
                    aspectRatio: 1 / 1,
                    ...tw("h-16 w-16 rounded object-cover"),
                  }}
                  src={data.companyDetails.signature}
                />
              </View>
            )}
            <View style={tw("flex flex-col gap-1 p-3 rounded-lg bg-neutral-50 border border-neutral-200")}>
              <View style={tw("flex flex-row items-center justify-between")}>
                <Text style={tw("text-2xs text-neutral-500")}>Subtotal</Text>
                <Text style={tw("text-xs font-geistmono tracking-tight")}>
                  {formatCurrencyText(data.invoiceDetails.currency, subtotal)}
                </Text>
              </View>
              {data.invoiceDetails.billingDetails.map((billingDetail, index) => (
                <View key={index} style={tw("flex flex-row items-center justify-between")}>
                  <Text style={tw("text-2xs text-neutral-500")}>{billingDetail.label}</Text>
                  <Text style={tw("text-xs font-geistmono tracking-tight")}>
                    {billingDetail.type === "percentage"
                      ? `${billingDetail.value} %`
                      : formatCurrencyText(data.invoiceDetails.currency, billingDetail.value)}
                  </Text>
                </View>
              ))}
              <View style={tw("border-t border-neutral-200 mt-1 pt-2")}>
                <View style={tw("flex flex-row items-center justify-between")}>
                  <Text style={tw("text-sm font-bold")}>Total Due</Text>
                  <Text style={tw(`text-lg font-bold font-geistmono tracking-tight text-[${baseColor}]`)}>
                    {formatCurrencyText(data.invoiceDetails.currency, total)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={tw("flex flex-col gap-0.5 mt-1.5")}>
              <Text style={tw("text-3xs text-neutral-400")}>Amount in words</Text>
              <Text style={tw("text-2xs text-neutral-600 capitalize")}>{toWords(total)}</Text>
            </View>
          </View>
        </View>

        {/* Bottom accent bar */}
        <View style={tw(`h-1.5 bg-[${baseColor}] w-full`)} />
      </Page>
    </Document>
  );
};

export default ProfessionalPDF;
