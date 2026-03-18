import Link from "next/link";
import { CreateEventForm } from "./create-event-form";
import { Button } from "@/components/ui/button";

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin">← Retour</Link>
        </Button>
      </div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Nouvel événement
      </h1>
      <CreateEventForm />
    </div>
  );
}
