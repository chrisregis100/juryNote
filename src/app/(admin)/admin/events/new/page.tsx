import Link from "next/link";
import { CreateEventForm } from "./create-event-form";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin" className="inline-flex items-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            <span>Retour</span>
          </Link>
        </Button>
      </div>
      <h1 className="text-2xl font-semibold text-slate-900">
        Nouvel événement
      </h1>
      <CreateEventForm />
    </div>
  );
}
