import { db } from "@/lib/db";
import { getServerSession, isOrganizerOrSupervisor } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  request: Request,
  context: { params: Promise<{ eventId: string }> }
) {
  const session = await getServerSession();
  if (!session?.user || !isOrganizerOrSupervisor(session)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { eventId } = await context.params;
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { id: true },
  });
  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  const encoder = new TextEncoder();
  const send = (controller: ReadableStreamDefaultController, data: object) => {
    controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
  };

  const stream = new ReadableStream({
    start(controller) {
      send(controller, { type: "connected", eventId });

      const interval = setInterval(async () => {
        try {
          const [gradeCount, deliberation] = await Promise.all([
            db.grade.count({
              where: { team: { eventId } },
            }),
            db.deliberation.findFirst({
              where: { eventId },
              orderBy: { createdAt: "desc" },
              select: { status: true },
            }),
          ]);
          send(controller, {
            type: "tick",
            gradesCount: gradeCount,
            deliberationStatus: deliberation?.status ?? "open",
          });
        } catch {
          send(controller, { type: "error" });
        }
      }, 3000);

      request.signal?.addEventListener("abort", () => {
        clearInterval(interval);
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store, no-cache, must-revalidate",
      Connection: "keep-alive",
    },
  });
}
