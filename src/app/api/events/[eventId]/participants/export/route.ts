import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import ExcelJS from "exceljs";
import { getServerSession, isOrganizerOrSupervisor } from "@/lib/auth";
import { escapeHtml } from "@/lib/utils/html-escape";

function sanitizeCsvCell(value: string): string {
  const trimmed = String(value).trim();
  if (/^[=+\-@\t\r]/.test(trimmed)) return `'${trimmed}`;
  return trimmed;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ eventId: string }> }
) {
  const session = await getServerSession();
  if (!session?.user || !isOrganizerOrSupervisor(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { eventId } = await context.params;
  const searchParams = request.nextUrl.searchParams;
  const format = searchParams.get("format") || "csv";

  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      customQuestions: { orderBy: { order: "asc" } },
      participantCheckins: {
        include: {
          answers: {
            include: {
              customQuestion: true,
            },
          },
        },
        orderBy: { checkedInAt: "desc" },
      },
    },
  });

  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  // Prepare data
  const rows: string[][] = [];
  const headers = [
    "Nom",
    "Email",
    "Téléphone",
    "Profession",
    "Statut",
    "Consentement photo",
    "Date d'enregistrement",
    ...event.customQuestions.map((q) => q.label),
  ];

  rows.push(headers);

  for (const checkin of event.participantCheckins) {
    const answerMap = new Map(
      checkin.answers.map((a) => [a.customQuestionId, a.value])
    );

    const row: string[] = [
      checkin.name,
      checkin.email,
      checkin.phone ?? "",
      checkin.profession ?? "",
      checkin.isInvited ? "Invité" : "Non invité",
      checkin.photoConsent ? "Oui" : "Non",
      new Date(checkin.checkedInAt).toLocaleString("fr-FR"),
      ...event.customQuestions.map((q) => {
        const answer = answerMap.get(q.id);
        if (!answer) return "-";
        if (q.type === "YES_NO") {
          return answer === "true" || answer === "oui" ? "Oui" : answer === "false" || answer === "non" ? "Non" : answer;
        }
        if (q.type === "MULTIPLE_CHOICE") {
          try {
            const parsed = JSON.parse(answer);
            return Array.isArray(parsed) ? parsed.join(", ") : parsed;
          } catch {
            return answer;
          }
        }
        return answer;
      }),
    ];
    rows.push(row);
  }

  if (format === "csv") {
    const csvContent = rows
      .map((row) =>
        row
          .map((cell) => `"${sanitizeCsvCell(cell).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const csvBuffer = Buffer.from("\ufeff" + csvContent, "utf-8"); // BOM for Excel

    return new NextResponse(csvBuffer, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="participants-${event.slug}-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  if (format === "xlsx") {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Participants");
    sheet.addRows(rows.map((row) => row.map(sanitizeCsvCell)));
    const buffer = Buffer.from(await workbook.xlsx.writeBuffer());

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="participants-${event.slug}-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    });
  }

  if (format === "pdf") {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Participants - ${escapeHtml(event.name)}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Participants - ${escapeHtml(event.name)}</h1>
          <table>
            ${rows.map((row, idx) => {
              const tag = idx === 0 ? "th" : "td";
              return `<tr>${row.map((cell) => `<${tag}>${escapeHtml(cell)}</${tag}>`).join("")}</tr>`;
            }).join("")}
          </table>
        </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="participants-${event.slug}-${new Date().toISOString().split("T")[0]}.html"`,
      },
    });
  }

  return NextResponse.json({ error: "Invalid format" }, { status: 400 });
}
