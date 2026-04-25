import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// ─────────────────────────────────────────────────────────────────────────────
// PDF Generator Engine for Smart Residency
// Uses browser-native HTML rendering for perfect Arabic RTL support
// ─────────────────────────────────────────────────────────────────────────────

const RESIDENCE_NAME = "الإقامة الجامعية عبد القادر بلعربي";
const RESIDENCE_SUBTITLE = "جامعة هواري بومدين للعلوم والتكنولوجيا";

// ─── Core HTML-to-PDF Engine ─────────────────────────────────────────────────

/**
 * Loads Amiri font into browser if not already loaded
 */
let browserFontLoaded = false;
async function ensureBrowserFont(): Promise<void> {
  if (browserFontLoaded) return;
  const fontFace = new FontFace("Amiri", "url(/fonts/Amiri-Regular.ttf)");
  const boldFace = new FontFace("Amiri", "url(/fonts/Amiri-Bold.ttf)", { weight: "bold" });
  await Promise.all([fontFace.load(), boldFace.load()]);
  document.fonts.add(fontFace);
  document.fonts.add(boldFace);
  browserFontLoaded = true;
}

/**
 * Renders an HTML string to a jsPDF document using the browser's native
 * text rendering engine. This guarantees correct Arabic shaping and RTL.
 */
async function htmlToPDF(htmlContent: string, orientation: "portrait" | "landscape" = "portrait"): Promise<jsPDF> {
  await ensureBrowserFont();

  const pageWidthPx = orientation === "portrait" ? 794 : 1123;

  // Use an iframe to isolate from the app's CSS (which uses lab() colors
  // that html2canvas cannot parse)
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.left = "-9999px";
  iframe.style.top = "0";
  iframe.style.width = `${pageWidthPx}px`;
  iframe.style.height = "0";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) throw new Error("Cannot access iframe document");

  // Write the full HTML into the iframe — completely isolated from app CSS
  iframeDoc.open();
  iframeDoc.write(`<!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="utf-8">
      <style>
        @font-face { font-family: 'Amiri'; src: url('/fonts/Amiri-Regular.ttf') format('truetype'); font-weight: normal; }
        @font-face { font-family: 'Amiri'; src: url('/fonts/Amiri-Bold.ttf') format('truetype'); font-weight: bold; }
      </style>
    </head>
    <body style="margin:0;padding:0;width:${pageWidthPx}px;background:white">
      ${htmlContent}
    </body>
    </html>`);
  iframeDoc.close();

  // Wait for fonts and rendering
  await new Promise(r => setTimeout(r, 300));

  // Resize iframe to content height
  const contentHeight = iframeDoc.body.scrollHeight;
  iframe.style.height = `${contentHeight}px`;

  // Capture with html2canvas inside the iframe
  const canvas = await html2canvas(iframeDoc.body, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    width: pageWidthPx,
    height: contentHeight,
  });

  document.body.removeChild(iframe);

  // Create PDF and add canvas as image
  const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const canvasAspect = canvas.width / canvas.height;
  const imgWidth = pageWidth;
  const imgHeight = imgWidth / canvasAspect;

  // If content is taller than one page, split across pages
  if (imgHeight <= pageHeight) {
    doc.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, imgHeight);
  } else {
    const totalPages = Math.ceil(imgHeight / pageHeight);
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) doc.addPage();
      doc.addImage(
        canvas.toDataURL("image/png"), "PNG",
        0, -(page * pageHeight),
        imgWidth, imgHeight
      );
    }
  }

  return doc;
}

// ─── HTML Template Helpers ───────────────────────────────────────────────────

const BASE_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body, html { font-family: 'Amiri', serif; direction: rtl; color: #1e293b; }
  .page { width: 100%; padding: 0; background: white; }
  .header { background: #0f172a; padding: 30px 40px 25px; text-align: center; }
  .header h1 { color: white; font-size: 22px; font-weight: bold; margin-bottom: 6px; }
  .header .subtitle { color: #94a3b8; font-size: 12px; margin-bottom: 12px; }
  .header .doc-title { color: #94a3b8; font-size: 16px; font-weight: bold; }
  .accent-bar { height: 3px; background: #3b82f6; }
  .content { padding: 20px 40px 30px; }
  .timestamp { text-align: center; color: #64748b; font-size: 10px; margin: 12px 0 20px; }
  .section-title {
    font-size: 15px; font-weight: bold; color: #0f172a;
    border-bottom: 2px solid #3b82f6; padding-bottom: 6px; margin: 20px 0 12px;
  }
  .info-row { display: flex; justify-content: flex-start; gap: 10px; margin: 5px 0; font-size: 12px; }
  .info-label { font-weight: bold; min-width: 120px; color: #334155; }
  .info-value { color: #475569; }
  .stats-grid { display: flex; gap: 12px; margin: 15px 0; flex-wrap: wrap; }
  .stat-card {
    flex: 1; min-width: 100px; background: #f8fafc; border-radius: 8px;
    padding: 15px 10px; text-align: center; position: relative; overflow: hidden;
  }
  .stat-card .bar { position: absolute; top: 0; left: 0; width: 4px; height: 100%; }
  .stat-card .value { font-size: 28px; font-weight: bold; margin-bottom: 4px; }
  .stat-card .label { font-size: 9px; color: #64748b; }
  table { width: 100%; border-collapse: collapse; margin: 10px 0; font-size: 11px; }
  thead th {
    background: #0f172a; color: white; padding: 10px 12px;
    text-align: center; font-weight: bold; font-size: 12px;
  }
  tbody td { padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  .footer {
    border-top: 1px solid #e2e8f0; margin-top: 30px; padding-top: 10px;
    text-align: center; font-size: 8px; color: #94a3b8;
  }
  .warning-box {
    background: #fef3c7; border-radius: 6px; padding: 12px 20px;
    text-align: center; font-weight: bold; color: #92400e; font-size: 12px;
    margin: 15px 0;
  }
  .signature-area { display: flex; justify-content: space-between; margin-top: 50px; padding: 0 30px; }
  .signature-block { text-align: center; }
  .signature-block .line { width: 150px; border-bottom: 1px solid #cbd5e1; margin-top: 40px; }
  .signature-block .sig-label { font-size: 11px; color: #475569; margin-bottom: 5px; }
`;

function makeTimestamp(): string {
  return new Date().toLocaleDateString("ar-DZ", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function wrapPage(title: string, bodyHtml: string): string {
  return `
    <style>${BASE_STYLES}</style>
    <div class="page">
      <div class="header">
        <h1>${RESIDENCE_NAME}</h1>
        <div class="subtitle">${RESIDENCE_SUBTITLE}</div>
        <div class="doc-title">${title}</div>
      </div>
      <div class="accent-bar"></div>
      <div class="content">
        <div class="timestamp">${makeTimestamp()}</div>
        ${bodyHtml}
        <div class="footer">${RESIDENCE_NAME} — وثيقة رسمية</div>
      </div>
    </div>
  `;
}

function makeStatsHtml(stats: { value: string | number; label: string; color: string }[]): string {
  return `<div class="stats-grid">${stats.map(s => `
    <div class="stat-card">
      <div class="bar" style="background:${s.color}"></div>
      <div class="value" style="color:${s.color}">${s.value}</div>
      <div class="label">${s.label}</div>
    </div>
  `).join("")}</div>`;
}

function makeTableHtml(headers: string[], rows: string[][]): string {
  return `
    <table>
      <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
      <tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>
  `;
}

function makeInfoRows(pairs: [string, string][]): string {
  return pairs.map(([label, value]) => `
    <div class="info-row">
      <span class="info-label">${label}:</span>
      <span class="info-value">${value}</span>
    </div>
  `).join("");
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC API: Async Report Generators
// ─────────────────────────────────────────────────────────────────────────────

/**
 * SPORTS ADMIN: Generate Daily Pitch Roster PDF
 */
export async function generatePitchRosterPDF(data: {
  date: string;
  facilityName: string;
  timeSlot: string;
  players: { name: string; roomNumber: string; studentId: string }[];
}): Promise<jsPDF> {
  const headers = ["الرقم", "اسم الطالب", "رقم الغرفة", "الرقم التعريفي"];
  const rows = data.players.map((p, i) => [
    String(i + 1), p.name, p.roomNumber || "—", p.studentId || "—",
  ]);

  const body = `
    <div class="section-title">معلومات الحصة</div>
    ${makeInfoRows([
      ["التاريخ", data.date],
      ["الملعب", data.facilityName],
      ["التوقيت", data.timeSlot],
    ])}
    <div class="section-title">قائمة اللاعبين</div>
    ${makeTableHtml(headers, rows)}
  `;

  return htmlToPDF(wrapPage("كشف قائمة اللاعبين اليومي", body));
}

/**
 * MAINTENANCE ADMIN: Generate Maintenance Summary Report PDF
 */
export async function generateMaintenanceSummaryPDF(data: {
  dateFrom: string;
  dateTo: string;
  tickets: {
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
    resolvedAt: string | null;
  }[];
  stats: { total: number; resolved: number; pending: number; critical: number };
}): Promise<jsPDF> {
  const statusMap: Record<string, string> = {
    open: "مفتوح", in_progress: "قيد المعالجة", resolved: "تم الحل", closed: "مغلق",
  };
  const categoryMap: Record<string, string> = {
    plumbing: "سباكة", electrical: "كهرباء", furniture: "أثاث", cleaning: "نظافة", general: "عام",
  };
  const priorityMap: Record<string, string> = {
    low: "منخفض", medium: "متوسط", high: "مرتفع", critical: "حرج",
  };

  const headers = ["العنوان", "الفئة", "الأولوية", "تاريخ الحل", "الحالة"];
  const rows = data.tickets.map(t => [
    t.title,
    categoryMap[t.category] || t.category,
    priorityMap[t.priority] || t.priority,
    t.resolvedAt ? new Date(t.resolvedAt).toLocaleDateString("ar-DZ") : "—",
    statusMap[t.status] || t.status,
  ]);

  const body = `
    <div class="section-title">فترة التقرير</div>
    ${makeInfoRows([["من", data.dateFrom], ["إلى", data.dateTo]])}
    <div class="section-title">ملخص الإحصائيات</div>
    ${makeStatsHtml([
      { value: data.stats.total, label: "إجمالي الطلبات", color: "#3b82f6" },
      { value: data.stats.resolved, label: "تم الحل", color: "#22c55e" },
      { value: data.stats.pending, label: "قيد الانتظار", color: "#fb923c" },
      { value: data.stats.critical, label: "عاجلة", color: "#ef4444" },
    ])}
    <div class="section-title">تفاصيل الطلبات</div>
    ${makeTableHtml(headers, rows)}
  `;

  return htmlToPDF(wrapPage("تقرير ملخص الصيانة", body));
}

/**
 * HOUSING ADMIN: Generate Official Summons PDF
 */
export async function generateSummonsPDF(data: {
  studentName: string;
  studentId: string;
  roomNumber: string;
  building: string;
  reason: string;
  details: string;
  summonsDate: string;
}): Promise<jsPDF> {
  const body = `
    <div class="warning-box">⚠️ تنبيه: هذه وثيقة رسمية صادرة عن إدارة الإقامة الجامعية</div>
    <div class="section-title">بيانات الطالب</div>
    ${makeInfoRows([
      ["الاسم الكامل", data.studentName],
      ["رقم التعريف", data.studentId],
      ["المبنى", data.building],
      ["رقم الغرفة", data.roomNumber],
    ])}
    <div class="section-title">تفاصيل الاستدعاء</div>
    ${makeInfoRows([
      ["تاريخ الاستدعاء", data.summonsDate],
      ["السبب", data.reason],
    ])}
    ${data.details ? `<p style="font-size:12px;margin:10px 0;line-height:1.8">${data.details}</p>` : ""}
    <div class="signature-area">
      <div class="signature-block">
        <div class="sig-label">توقيع المسؤول</div>
        <div class="line"></div>
      </div>
      <div class="signature-block">
        <div class="sig-label">توقيع الطالب</div>
        <div class="line"></div>
      </div>
    </div>
  `;

  return htmlToPDF(wrapPage("استدعاء إداري رسمي", body));
}

/**
 * HOUSING ADMIN: Generate Occupancy Report PDF
 */
export async function generateOccupancyReportPDF(data: {
  totalRooms: number;
  occupiedRooms: number;
  emptyRooms: number;
  students: { name: string; studentId: string; building: string; roomNumber: string }[];
}): Promise<jsPDF> {
  const occupancyRate = data.totalRooms > 0 ? Math.round((data.occupiedRooms / data.totalRooms) * 100) : 0;

  const headers = ["الرقم", "اسم الطالب", "رقم الغرفة", "المبنى", "الرقم التعريفي"];
  const rows = data.students.map((s, i) => [
    String(i + 1), s.name, s.roomNumber || "—", s.building || "—", s.studentId || "—",
  ]);

  const body = `
    <div class="section-title">ملخص الإشغال</div>
    ${makeStatsHtml([
      { value: data.totalRooms, label: "إجمالي الغرف", color: "#3b82f6" },
      { value: data.occupiedRooms, label: "مشغولة", color: "#22c55e" },
      { value: data.emptyRooms, label: "شاغرة", color: "#fb923c" },
    ])}
    <div class="section-title">نسبة الإشغال: ${occupancyRate}%</div>
    <div style="background:#e2e8f0;border-radius:6px;height:10px;margin:8px 0 20px;overflow:hidden">
      <div style="background:#22c55e;height:100%;width:${occupancyRate}%;border-radius:6px"></div>
    </div>
    <div class="section-title">قائمة الطلبة المقيمين</div>
    ${makeTableHtml(headers, rows)}
  `;

  return htmlToPDF(wrapPage("تقرير حالة الإيواء", body));
}

/**
 * DIRECTOR: Generate Residence Performance Report PDF
 */
export async function generatePerformanceReportPDF(data: {
  totalIssues: number;
  resolvedIssues: number;
  successRate: number;
  totalStudents: number;
  totalBookings: number;
  totalAnnouncements: number;
  issuesByCategory: { category: string; count: number }[];
  recentIssues: { title: string; category: string; status: string; createdAt: string }[];
}): Promise<jsPDF> {
  const categoryMap: Record<string, string> = {
    plumbing: "سباكة", electrical: "كهرباء", furniture: "أثاث", cleaning: "نظافة", general: "عام",
  };
  const statusMap: Record<string, string> = {
    open: "مفتوح", in_progress: "قيد المعالجة", resolved: "تم الحل", closed: "مغلق",
  };

  const catHeaders = ["الفئة", "العدد"];
  const catRows = data.issuesByCategory.map(c => [
    categoryMap[c.category] || c.category, String(c.count),
  ]);

  const issueHeaders = ["العنوان", "الفئة", "التاريخ", "الحالة"];
  const issueRows = data.recentIssues.map(i => [
    i.title,
    categoryMap[i.category] || i.category,
    new Date(i.createdAt).toLocaleDateString("ar-DZ"),
    statusMap[i.status] || i.status,
  ]);

  const body = `
    <div class="section-title">مؤشرات الأداء الرئيسية</div>
    ${makeStatsHtml([
      { value: data.totalIssues, label: "إجمالي الشكاوى", color: "#3b82f6" },
      { value: data.resolvedIssues, label: "تم حلها", color: "#22c55e" },
      { value: `${data.successRate}%`, label: "نسبة النجاح", color: "#a855f7" },
      { value: data.totalStudents, label: "الطلبة المقيمين", color: "#fb923c" },
    ])}
    <div class="section-title">إحصائيات الاستخدام</div>
    ${makeInfoRows([
      ["إجمالي الحجوزات الرياضية", String(data.totalBookings)],
      ["إجمالي الإعلانات", String(data.totalAnnouncements)],
    ])}
    <div class="section-title">الشكاوى حسب الفئة</div>
    ${makeTableHtml(catHeaders, catRows)}
    <div class="section-title">قائمة الشكاوى التفصيلية</div>
    ${makeTableHtml(issueHeaders, issueRows)}
  `;

  return htmlToPDF(wrapPage("تقرير أداء الإقامة الجامعية", body));
}
