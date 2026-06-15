import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { Settings } from "@/features/settings/types";
import type { LocalizedText, Order } from "../types";

let fontLoadPromise: Promise<void> | null = null;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function ensureFonts(doc: jsPDF): Promise<void> {
  if (!fontLoadPromise) {
    fontLoadPromise = (async () => {
      const [regularRes, boldRes] = await Promise.all([
        fetch("/fonts/DejaVuSans.ttf"),
        fetch("/fonts/DejaVuSans-Bold.ttf"),
      ]);

      if (!regularRes.ok || !boldRes.ok) {
        throw new Error("Invoice font files could not be loaded");
      }

      const regularBase64 = arrayBufferToBase64(await regularRes.arrayBuffer());
      const boldBase64 = arrayBufferToBase64(await boldRes.arrayBuffer());

      doc.addFileToVFS("DejaVuSans.ttf", regularBase64);
      doc.addFileToVFS("DejaVuSans-Bold.ttf", boldBase64);
      doc.addFont("DejaVuSans.ttf", "DejaVuSans", "normal");
      doc.addFont("DejaVuSans-Bold.ttf", "DejaVuSans", "bold");
    })();
  }

  await fontLoadPromise;
  doc.setFont("DejaVuSans", "normal");
}

function formatMoney(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return "0.00";
  return n.toFixed(2);
}

function formatDate(value: unknown): string {
  const d = value ? new Date(String(value)) : new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`;
}

function getItemName(name: LocalizedText | string | undefined): string {
  if (!name) return "";
  if (typeof name === "string") return name;
  return name.ka || name.en || "";
}

function getDeliveryTypeLabel(deliveryType: string): string {
  switch (deliveryType) {
    case "tbilisi":
      return "თბილისი";
    case "region":
      return "რეგიონი";
    case "officePickup":
      return "გატანა ოფისიდან";
    default:
      return deliveryType;
  }
}

function getInvoiceFilename(order: Order): string {
  const safeUuid = (order.uuid || "order").replace(/[^\w-]/g, "_");
  return `invoice-${safeUuid}.pdf`;
}

export async function generateOrderInvoice(
  order: Order,
  settings?: Settings | null,
): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  await ensureFonts(doc);

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  doc.setFillColor(249, 195, 0);
  doc.rect(margin, margin, contentWidth, 10, "F");
  doc.setFont("DejaVuSans", "bold");
  doc.setFontSize(16);
  doc.setTextColor(31, 31, 31);
  doc.text("DEWALT", margin + 4, margin + 7);

  let y = margin + 18;

  doc.setFont("DejaVuSans", "bold");
  doc.setFontSize(14);
  doc.setTextColor(17, 17, 17);
  doc.text("ინვოისი", pageWidth - margin, y, { align: "right" });

  y += 5;
  doc.setFont("DejaVuSans", "normal");
  doc.setFontSize(8);
  doc.setTextColor(85, 85, 85);

  const companyLines = [
    settings?.contactAddress?.ka,
    settings?.contactPhone ? `ტელ: ${settings.contactPhone}` : undefined,
    settings?.contactEmail,
  ].filter(Boolean) as string[];

  for (const line of companyLines) {
    doc.text(line, pageWidth - margin, y, { align: "right" });
    y += 4;
  }

  y += 6;
  doc.setFontSize(10);
  doc.setTextColor(17, 17, 17);

  const metaLines = [
    `შეკვეთის კოდი: ${order.uuid}`,
    `თარიღი: ${formatDate(order.createdAt)}`,
    `მყიდველი: ${order.name} ${order.surname}`,
    `ტელეფონი: ${order.phone}`,
    `პირადი ნომერი: ${order.personalId}`,
    `მისამართი: ${order.address}`,
    `მიწოდება: ${getDeliveryTypeLabel(order.deliveryType)}`,
  ];

  for (const line of metaLines) {
    doc.text(line, margin, y);
    y += 5;
  }

  y += 2;

  const tableBody = (order.items || []).map((item) => {
    const itemName = getItemName(item.name);
    const finaCode = item.finaCode ? ` (${item.finaCode})` : "";
    return [
      `${itemName}${finaCode}`,
      String(item.quantity),
      `GEL ${formatMoney(item.unitPrice)}`,
      `GEL ${formatMoney(item.lineTotal)}`,
    ];
  });

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["პროდუქტი", "რაოდ.", "ფასი", "ჯამი"]],
    body: tableBody,
    styles: {
      font: "DejaVuSans",
      fontSize: 9,
      cellPadding: 2,
    },
    headStyles: {
      font: "DejaVuSans",
      fontStyle: "bold",
      fillColor: [243, 243, 243],
      textColor: [51, 51, 51],
    },
    columnStyles: {
      0: { cellWidth: contentWidth * 0.5 },
      1: { halign: "center", cellWidth: 18 },
      2: { halign: "right", cellWidth: 28 },
      3: { halign: "right", cellWidth: 28 },
    },
  });

  const finalY =
  (
    doc as jsPDF & {
      lastAutoTable?: { finalY: number };
    }
  ).lastAutoTable?.finalY ?? y + 20;

  let totalsY = finalY + 8;
  const totalsX = margin + contentWidth * 0.55;
  const valueX = pageWidth - margin;

  const drawTotalRow = (label: string, value: string, bold = false) => {
    doc.setFont("DejaVuSans", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 11 : 10);
    doc.text(label, totalsX, totalsY);
    doc.text(value, valueX, totalsY, { align: "right" });
    totalsY += bold ? 6 : 5;
  };

  drawTotalRow("ქვეჯამი:", `GEL ${formatMoney(order.subtotal)}`);
  drawTotalRow("მიწოდების ფასი:", `GEL ${formatMoney(order.deliveryPrice)}`);
  totalsY += 1;
  drawTotalRow("ჯამი:", `GEL ${formatMoney(order.total)}`, true);

  doc.save(getInvoiceFilename(order));
}
