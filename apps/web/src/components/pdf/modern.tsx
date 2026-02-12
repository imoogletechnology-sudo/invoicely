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
      fontSize: {
        "2xs": "0.625rem",
        "3xs": "0.5rem",
      },
    },
  },
});

const ModernPDF: React.FC<{ data: ZodCreateInvoiceSchema }> = ({ data }) => {
  const subtotal = getSubTotalValue(data);
  const total = getTotalValue(data);
  const baseColor = data.invoiceDetails.theme.baseColor || "#635CFF";

  return (
    <Document
      title={`Invoice-${data.invoiceDetails.prefix}${data.invoiceDetails.serialNumber}`}
      author={data.companyDetails.name}
      creator={data.companyDetails.name}
      producer="Invoicely"
    >
      <Page size="A4" style={tw("font-default text-sm text-neutral-800 bg-white p-0")}>
        {/* Hero Header with accent background */}
        <View style={tw(`bg-[${baseColor}] px-8 pt-8 pb-10`)}>
          <View style={tw("flex flex-row justify-between items-start")}>
            <View style={tw("flex flex-col gap-1")}>
              {data.companyDetails.logo ? (
                <Image
                  style={{
                    aspectRatio: 16 / 9,
                    ...tw("w-20 h-12 object-contain object-left"),
                  }}
                  src={data.companyDetails.logo}
                />
              ) : (
                <Text style={tw("text-lg font-bold text-white")}>{data.companyDetails.name}</Text>
              )}
              <Text style={tw("text-2xs text-white opacity-70 max-w-[200px] mt-0.5")}>
                {data.companyDetails.address}
              </Text>
            </View>
            <View style={tw("flex flex-col items-end")}>
              <Text style={tw("text-3xl font-bold text-white tracking-tight")}>INVOICE</Text>
              <Text style={tw("text-xs font-geistmono text-white opacity-60 tracking-tight mt-0.5")}>
                #{data.invoiceDetails.prefix}{data.invoiceDetails.serialNumber}
              </Text>
            </View>
          </View>
        </View>

        {/* Info Cards - overlapping the hero */}
        <View style={tw("flex flex-row px-8 -mt-6 gap-3")}>
          <View style={tw("flex flex-col gap-0.5 bg-white rounded-lg p-3 shadow-sm border border-neutral-100 w-1/4")}>
            <Text style={tw("text-3xs font-medium text-neutral-400 uppercase tracking-wider")}>Date</Text>
            <Text style={tw("text-2xs font-semibold")}>{format(data.invoiceDetails.date, "dd MMM yyyy")}</Text>
          </View>
          {data.invoiceDetails.dueDate && (
            <View style={tw("flex flex-col gap-0.5 bg-white rounded-lg p-3 shadow-sm border border-neutral-100 w-1/4")}>
              <Text style={tw("text-3xs font-medium text-neutral-400 uppercase tracking-wider")}>Due</Text>
              <Text style={tw("text-2xs font-semibold")}>{format(data.invoiceDetails.dueDate, "dd MMM yyyy")}</Text>
            </View>
          )}
          <View style={tw("flex flex-col gap-0.5 bg-white rounded-lg p-3 shadow-sm border border-neutral-100 w-1/4")}>
            <Text style={tw("text-3xs font-medium text-neutral-400 uppercase tracking-wider")}>Currency</Text>
            <Text style={tw("text-2xs font-semibold")}>{getCurrencyDisplayLabel(data.invoiceDetails.currency)}</Text>
          </View>
          <View style={tw(`flex flex-col gap-0.5 bg-[${baseColor}] rounded-lg p-3 shadow-sm w-1/4`)}>
            <Text style={tw("text-3xs font-medium text-white opacity-70 uppercase tracking-wider")}>Total</Text>
            <Text style={tw("text-sm font-bold font-geistmono tracking-tight text-white")}>
              {formatCurrencyText(data.invoiceDetails.currency, total)}
            </Text>
          </View>
        </View>

        {/* Billing Section */}
        <View style={tw("flex flex-row px-8 mt-5 gap-6")}>
          <View style={tw("flex flex-col gap-1 w-1/2")}>
            <View style={tw("flex flex-row items-center gap-1.5 mb-1")}>
              <View style={tw(`w-1 h-3 rounded bg-[${baseColor}]`)} />
              <Text style={tw("text-2xs font-semibold uppercase tracking-wider text-neutral-400")}>From</Text>
            </View>
            <Text style={tw("text-sm font-bold")}>{data.companyDetails.name}</Text>
            <Text style={tw("text-2xs text-neutral-500 leading-4")}>{data.companyDetails.address}</Text>
            {data.companyDetails.metadata.map((metadata) => (
              <View key={metadata.label} style={tw("flex flex-row items-center gap-1")}>
                <Text style={tw("text-2xs font-medium text-neutral-500")}>{metadata.label}:</Text>
                <Text style={tw("text-2xs text-neutral-400")}>{metadata.value}</Text>
              </View>
            ))}
          </View>
          <View style={tw("flex flex-col gap-1 w-1/2")}>
            <View style={tw("flex flex-row items-center gap-1.5 mb-1")}>
              <View style={tw(`w-1 h-3 rounded bg-[${baseColor}]`)} />
              <Text style={tw("text-2xs font-semibold uppercase tracking-wider text-neutral-400")}>Bill To</Text>
            </View>
            <Text style={tw("text-sm font-bold")}>{data.clientDetails.name}</Text>
            <Text style={tw("text-2xs text-neutral-500 leading-4")}>{data.clientDetails.address}</Text>
            {data.clientDetails.metadata.map((metadata) => (
              <View key={metadata.label} style={tw("flex flex-row items-center gap-1")}>
                <Text style={tw("text-2xs font-medium text-neutral-500")}>{metadata.label}:</Text>
                <Text style={tw("text-2xs text-neutral-400")}>{metadata.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Items Table */}
        <View style={tw("mx-8 mt-5 grow")}>
          <View
            style={tw("flex-row flex items-center px-3 py-2 text-2xs rounded-lg bg-neutral-50 border border-neutral-100")}
          >
            <Text style={tw("w-[50%] font-semibold text-neutral-500 uppercase tracking-wider")}>Item</Text>
            <Text style={tw("w-[10%] text-center font-semibold text-neutral-500 uppercase tracking-wider")}>Qty</Text>
            <Text style={tw("w-[18%] text-right font-semibold text-neutral-500 uppercase tracking-wider")}>Rate</Text>
            <Text style={tw("w-[22%] text-right font-semibold text-neutral-500 uppercase tracking-wider")}>Amount</Text>
          </View>
          <View style={tw("flex flex-col")}>
            {data.items.map((item, index) => (
              <View
                key={index}
                style={tw("flex-row px-3 py-2.5 border-b border-neutral-50")}
              >
                <View style={tw("flex flex-col w-[50%]")}>
                  <Text style={tw("text-xs font-medium")}>{item.name}</Text>
                  {item.description ? (
                    <Text style={tw("text-2xs text-neutral-400 mt-0.5")}>{item.description}</Text>
                  ) : null}
                </View>
                <Text style={tw("w-[10%] text-center font-geistmono tracking-tight text-xs")}>{item.quantity}</Text>
                <Text style={tw("w-[18%] text-right font-geistmono tracking-tight text-xs text-neutral-600")}>
                  {formatCurrencyText(data.invoiceDetails.currency, item.unitPrice)}
                </Text>
                <Text style={tw("w-[22%] text-right font-geistmono tracking-tight text-xs font-semibold")}>
                  {formatCurrencyText(data.invoiceDetails.currency, item.quantity * item.unitPrice)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={tw("flex flex-row px-8 pb-6 gap-6")}>
          {/* Left: Meta */}
          <View style={tw("flex flex-col w-1/2 gap-3 justify-end")}>
            {data.metadata.paymentInformation.length > 0 && (
              <View style={tw("flex flex-col gap-1")}>
                <View style={tw("flex flex-row items-center gap-1.5 mb-0.5")}>
                  <View style={tw(`w-1 h-3 rounded bg-[${baseColor}]`)} />
                  <Text style={tw("text-2xs font-semibold uppercase tracking-wider text-neutral-400")}>
                    Payment Details
                  </Text>
                </View>
                {data.metadata.paymentInformation.map((info, index) => (
                  <View key={index} style={tw("flex flex-row items-center gap-1")}>
                    <Text style={tw("text-2xs font-medium text-neutral-500 min-w-[80px]")}>{info.label}</Text>
                    <Text style={tw("text-2xs text-neutral-400")}>{info.value}</Text>
                  </View>
                ))}
              </View>
            )}
            {data.metadata.terms ? (
              <View style={tw("flex flex-col gap-0.5")}>
                <Text style={tw("text-2xs font-semibold text-neutral-500")}>Terms</Text>
                <Text style={tw("text-2xs text-neutral-400 leading-4")}>{data.metadata.terms}</Text>
              </View>
            ) : null}
            {data.metadata.notes ? (
              <View style={tw("flex flex-col gap-0.5")}>
                <Text style={tw("text-2xs font-semibold text-neutral-500")}>Notes</Text>
                <Text style={tw("text-2xs text-neutral-400 leading-4")}>{data.metadata.notes}</Text>
              </View>
            ) : null}
          </View>

          {/* Right: Totals */}
          <View style={tw("flex flex-col w-1/2 justify-end")}>
            {data.companyDetails.signature && (
              <View style={tw("flex flex-col items-end gap-1 mb-2")}>
                <Image
                  style={{
                    aspectRatio: 1 / 1,
                    ...tw("h-14 w-14 rounded object-cover"),
                  }}
                  src={data.companyDetails.signature}
                />
                <Text style={tw("text-3xs text-neutral-400")}>Signature</Text>
              </View>
            )}
            <View style={tw("flex flex-col gap-1")}>
              <View style={tw("flex flex-row items-center justify-between")}>
                <Text style={tw("text-2xs text-neutral-400")}>Subtotal</Text>
                <Text style={tw("text-xs font-geistmono tracking-tight")}>
                  {formatCurrencyText(data.invoiceDetails.currency, subtotal)}
                </Text>
              </View>
              {data.invoiceDetails.billingDetails.map((billingDetail, index) => (
                <View key={index} style={tw("flex flex-row items-center justify-between")}>
                  <Text style={tw("text-2xs text-neutral-400")}>{billingDetail.label}</Text>
                  <Text style={tw("text-xs font-geistmono tracking-tight")}>
                    {billingDetail.type === "percentage"
                      ? `${billingDetail.value} %`
                      : formatCurrencyText(data.invoiceDetails.currency, billingDetail.value)}
                  </Text>
                </View>
              ))}
              <View style={tw(`mt-1.5 p-3 rounded-lg bg-[${baseColor}]`)}>
                <View style={tw("flex flex-row items-center justify-between")}>
                  <Text style={tw("text-xs font-semibold text-white")}>Total Due</Text>
                  <Text style={tw("text-lg font-bold font-geistmono tracking-tight text-white")}>
                    {formatCurrencyText(data.invoiceDetails.currency, total)}
                  </Text>
                </View>
              </View>
              <View style={tw("flex flex-col gap-0.5 mt-1")}>
                <Text style={tw("text-3xs text-neutral-400")}>Amount in words</Text>
                <Text style={tw("text-2xs text-neutral-500 capitalize")}>{toWords(total)}</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ModernPDF;
