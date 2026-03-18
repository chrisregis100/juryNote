import { JuryJoinForm } from "./jury-join-form";

export default function JuryJoinPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900">
          Accès jury
        </h1>
        <p className="text-sm text-slate-600">
          Entrez le slug de l’événement et votre code à 6 chiffres.
        </p>
        <JuryJoinForm />
      </div>
    </main>
  );
}
