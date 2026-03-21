"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CustomQuestion } from "@prisma/client";
import { findInvitedParticipant, checkinParticipant } from "@/server/actions/checkin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/cn";

interface CheckinFormProps {
  eventId: string;
  eventName: string;
  customQuestions: CustomQuestion[];
}

type Step = "name" | "info" | "questions" | "confirm" | "success";

const STEPS: { id: Step; label: string }[] = [
  { id: "name", label: "Nom" },
  { id: "info", label: "Infos" },
  { id: "questions", label: "Questions" },
  { id: "confirm", label: "Vérif" },
];

const STEP_ORDER: Step[] = ["name", "info", "questions", "confirm"];

// ─── Sub-components ──────────────────────────────────────────────────────────

const NeoButton = ({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline";
}) => (
  <button
    className={cn(
      "inline-flex h-12 w-full items-center justify-center rounded-md border-2 border-black text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      variant === "primary"
        ? "bg-black text-white shadow-[4px_4px_0_0_#4f46e5] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#4f46e5]"
        : "bg-white text-black hover:bg-slate-50",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const NeoInput = (props: React.InputHTMLAttributes<HTMLInputElement> & { id: string }) => (
  <Input
    {...props}
    className="mt-1 border-2 border-black focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-0"
  />
);

const NeoLabel = ({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) => (
  <Label htmlFor={htmlFor} className="text-sm font-bold text-black">
    {children}
  </Label>
);

const NeoSelect = ({
  id,
  value,
  onChange,
  required,
  children,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <select
    id={id}
    value={value}
    onChange={onChange}
    required={required}
    className="mt-1 flex h-10 w-full rounded-md border-2 border-black bg-white px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
  >
    {children}
  </select>
);

// ─── Step Indicator ───────────────────────────────────────────────────────────

const StepIndicator = ({
  currentStep,
  hasQuestions,
}: {
  currentStep: Step;
  hasQuestions: boolean;
}) => {
  const visibleSteps = hasQuestions ? STEPS : STEPS.filter((s) => s.id !== "questions");
  const currentIdx = visibleSteps.findIndex((s) => s.id === currentStep);

  return (
    <div className="mb-8 flex items-center justify-center gap-0" role="list" aria-label="Étapes">
      {visibleSteps.map((s, idx) => {
        const isDone = idx < currentIdx;
        const isActive = idx === currentIdx;

        return (
          <div key={s.id} className="flex items-center" role="listitem">
            <div className="flex flex-col items-center gap-1">
              <div
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full border-2 border-black text-sm font-black transition-all",
                  isDone
                    ? "bg-indigo-600 text-white"
                    : isActive
                      ? "bg-yellow-400 text-black shadow-[3px_3px_0_0_#0a0a0a]"
                      : "bg-white text-slate-400"
                )}
              >
                {isDone ? "✓" : idx + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-wide",
                  isActive ? "text-black" : isDone ? "text-indigo-600" : "text-slate-400"
                )}
              >
                {s.label}
              </span>
            </div>
            {idx < visibleSteps.length - 1 && (
              <div
                className={cn(
                  "mb-5 h-0.5 w-8 transition-all",
                  idx < currentIdx ? "bg-indigo-600" : "bg-slate-200"
                )}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function CheckinForm({ eventId, eventName, customQuestions }: CheckinFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [invitedParticipant, setInvitedParticipant] = useState<{
    id: string;
    email?: string | null;
    phone?: string | null;
    profession?: string | null;
  } | null>(null);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("");
  const [photoConsent, setPhotoConsent] = useState(false);

  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleNameSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Veuillez entrer votre nom");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const found = await findInvitedParticipant(eventId, name.trim());
      if (found) {
        setInvitedParticipant(found);
        setEmail(found.email || "");
        setPhone(found.phone || "");
        setProfession(found.profession || "");
      } else {
        setInvitedParticipant(null);
        setEmail("");
        setPhone("");
        setProfession("");
      }
      setStep("info");
    } catch {
      setError("Erreur lors de la recherche. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !phone.trim() || !profession.trim()) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (!photoConsent) {
      setError("Le consentement photo est requis");
      return;
    }
    setError(null);
    setStep(customQuestions.length > 0 ? "questions" : "confirm");
  };

  const handleQuestionsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredQuestions = customQuestions.filter((q) => q.isRequired);
    for (const q of requiredQuestions) {
      if (!answers[q.id] || answers[q.id].trim() === "") {
        setError(`La question "${q.label}" est obligatoire`);
        return;
      }
    }
    setError(null);
    setStep("confirm");
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const answersArray = Object.entries(answers).map(([customQuestionId, value]) => ({
        customQuestionId,
        value: typeof value === "string" ? value : JSON.stringify(value),
      }));

      const formData = new FormData();
      formData.set("eventId", eventId);
      formData.set("name", name.trim());
      formData.set("email", email.trim());
      formData.set("phone", phone.trim());
      formData.set("profession", profession.trim());
      formData.set("photoConsent", String(photoConsent));
      formData.set("invitedParticipantId", invitedParticipant?.id || "");
      formData.set("answers", JSON.stringify(answersArray));

      const result = await checkinParticipant(formData);
      if (result.error) {
        setError(Object.values(result.error).flat().join(", "));
        setIsLoading(false);
        return;
      }
      setStep("success");
    } catch {
      setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  // ── Success screen ──
  if (step === "success") {
    return (
      <div className="rounded-xl border-2 border-black bg-white p-8 shadow-[8px_8px_0_0_#0a0a0a] text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-yellow-400 text-3xl shadow-[3px_3px_0_0_#0a0a0a]">
          🎉
        </div>
        <h2 className="text-2xl font-black text-black">Enregistrement réussi !</h2>
        <p className="mt-3 text-slate-600">
          Merci{" "}
          <span className="inline-block -rotate-1 bg-yellow-400 px-1 font-bold text-black">
            {name}
          </span>
          , votre présence a été confirmée pour{" "}
          <strong className="text-black">{eventName}</strong>.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 inline-flex h-10 items-center justify-center rounded-md border-2 border-black bg-white px-6 text-sm font-bold text-black transition-all hover:bg-slate-50"
        >
          Retour à l&apos;accueil
        </button>
      </div>
    );
  }

  const currentStepInOrder = STEP_ORDER.indexOf(step);

  return (
    <div className="rounded-xl border-2 border-black bg-white p-6 shadow-[8px_8px_0_0_#0a0a0a] md:p-8">
      <StepIndicator currentStep={step} hasQuestions={customQuestions.length > 0} />

      {/* Error banner */}
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border-2 border-rose-500 bg-rose-50 p-3 text-sm font-medium text-rose-700"
        >
          ⚠ {error}
        </div>
      )}

      {/* ── Step 1 : Name ── */}
      {step === "name" && (
        <form onSubmit={handleNameSearch} className="space-y-5" noValidate>
          <div>
            <NeoLabel htmlFor="name">Votre nom complet</NeoLabel>
            <NeoInput
              id="name"
              placeholder="Ex. : Marie Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              aria-describedby={error ? "form-error" : undefined}
            />
          </div>
          <NeoButton type="submit" disabled={isLoading}>
            {isLoading ? "Recherche en cours…" : "Continuer →"}
          </NeoButton>
        </form>
      )}

      {/* ── Step 2 : Info ── */}
      {step === "info" && (
        <form onSubmit={handleInfoSubmit} className="space-y-5" noValidate>
          {invitedParticipant ? (
            <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">
              ✓ Vous êtes bien dans la liste des invités
            </div>
          ) : (
            <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-3 text-sm font-medium text-yellow-800">
              ⚠ Vous n&apos;êtes pas dans la liste, mais vous pouvez quand même vous enregistrer.
            </div>
          )}

          <div>
            <NeoLabel htmlFor="email">Email *</NeoLabel>
            <NeoInput
              id="email"
              type="email"
              placeholder="marie@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <NeoLabel htmlFor="phone">Téléphone *</NeoLabel>
            <NeoInput
              id="phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <NeoLabel htmlFor="profession">Profession *</NeoLabel>
            <NeoInput
              id="profession"
              placeholder="Développeur·se, Designer, etc."
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              required
            />
          </div>

          <div className="flex items-start gap-3 rounded-lg border-2 border-black bg-slate-50 p-3">
            <Checkbox
              id="photoConsent"
              checked={photoConsent}
              onChange={(e) => setPhotoConsent(e.target.checked)}
              required
              className="mt-0.5 h-5 w-5 rounded border-2 border-black"
              aria-describedby="photo-consent-desc"
            />
            <Label htmlFor="photoConsent" id="photo-consent-desc" className="cursor-pointer text-sm font-medium text-black leading-snug">
              J&apos;accepte que des photos soient prises pendant l&apos;événement *
            </Label>
          </div>

          <div className="flex gap-3">
            <NeoButton
              type="button"
              variant="outline"
              onClick={() => { setError(null); setStep("name"); }}
              className="flex-1"
            >
              ← Retour
            </NeoButton>
            <NeoButton type="submit" className="flex-1">
              Suivant →
            </NeoButton>
          </div>
        </form>
      )}

      {/* ── Step 3 : Custom questions ── */}
      {step === "questions" && (
        <form onSubmit={handleQuestionsSubmit} className="space-y-5" noValidate>
          {customQuestions.map((question) => {
            let optionsArray: string[] = [];
            try {
              optionsArray = question.options ? JSON.parse(question.options) : [];
            } catch {
              optionsArray = [];
            }

            return (
              <div key={question.id}>
                <NeoLabel htmlFor={`q-${question.id}`}>
                  {question.label} {question.isRequired && <span aria-hidden="true">*</span>}
                </NeoLabel>

                {question.type === "TEXT" && (
                  <NeoInput
                    id={`q-${question.id}`}
                    value={answers[question.id] || ""}
                    onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                    required={question.isRequired}
                  />
                )}

                {question.type === "MULTIPLE_CHOICE" && (
                  <NeoSelect
                    id={`q-${question.id}`}
                    value={answers[question.id] || ""}
                    onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                    required={question.isRequired}
                  >
                    <option value="">Sélectionnez une option</option>
                    {optionsArray.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </NeoSelect>
                )}

                {question.type === "YES_NO" && (
                  <NeoSelect
                    id={`q-${question.id}`}
                    value={answers[question.id] || ""}
                    onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                    required={question.isRequired}
                  >
                    <option value="">Sélectionnez</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                  </NeoSelect>
                )}

                {question.type === "DATE" && (
                  <NeoInput
                    id={`q-${question.id}`}
                    type="date"
                    value={answers[question.id] || ""}
                    onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                    required={question.isRequired}
                  />
                )}

                {question.type === "NUMBER" && (
                  <NeoInput
                    id={`q-${question.id}`}
                    type="number"
                    value={answers[question.id] || ""}
                    onChange={(e) => setAnswers({ ...answers,[question.id]: e.target.value })}
                    required={question.isRequired}
                  />
                )}
              </div>
            );
          })}

          <div className="flex gap-3">
            <NeoButton
              type="button"
              variant="outline"
              onClick={() => { setError(null); setStep("info"); }}
              className="flex-1"
            >
              ← Retour
            </NeoButton>
            <NeoButton type="submit" className="flex-1">
              Suivant →
            </NeoButton>
          </div>
        </form>
      )}

      {/* ── Step 4 : Confirm ── */}
      {step === "confirm" && (
        <div className="space-y-5">
          <h3 className="font-black text-black text-lg">
            <span className="inline-block -rotate-1 bg-yellow-400 px-2">
              Vérifiez vos informations
            </span>
          </h3>

          <dl className="space-y-2 rounded-lg border-2 border-black bg-slate-50 p-4 text-sm">
            {[
              { term: "Nom", value: name },
              { term: "Email", value: email },
              { term: "Téléphone", value: phone },
              { term: "Profession", value: profession },
              { term: "Consentement photo", value: photoConsent ? "Oui ✓" : "Non" },
            ].map(({ term, value }) => (
              <div key={term} className="flex justify-between gap-4">
                <dt className="font-bold text-black">{term}</dt>
                <dd className="text-slate-700 text-right">{value}</dd>
              </div>
            ))}

            {customQuestions.length > 0 && (
              <div className="mt-3 border-t border-black/10 pt-3 space-y-2">
                <div className="font-bold text-black text-xs uppercase tracking-wide">
                  Réponses aux questions
                </div>
                {customQuestions.map((q) => {
                  const answer = answers[q.id];
                  const displayValue =
                    q.type === "YES_NO"
                      ? answer === "oui"
                        ? "Oui"
                        : answer === "non"
                          ? "Non"
                          : "—"
                      : answer || "—";
                  return (
                    <div key={q.id} className="flex justify-between gap-4 text-xs">
                      <dt className="font-medium text-black">{q.label}</dt>
                      <dd className="text-slate-700 text-right">{displayValue}</dd>
                    </div>
                  );
                })}
              </div>
            )}
          </dl>

          <div className="flex gap-3">
            <NeoButton
              type="button"
              variant="outline"
              onClick={() => {
                setError(null);
                setStep(customQuestions.length > 0 ? "questions" : "info");
              }}
              className="flex-1"
            >
              ← Retour
            </NeoButton>
            <NeoButton
              type="button"
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? "Enregistrement…" : "Confirmer ✓"}
            </NeoButton>
          </div>
        </div>
      )}

      {/* Step counter footnote */}
      <p className="mt-6 text-center text-xs text-slate-400">
        Étape{" "}
        <span className="font-bold text-slate-600">
          {currentStepInOrder + 1}
        </span>{" "}
        sur{" "}
        <span className="font-bold text-slate-600">
          {customQuestions.length > 0 ? 4 : 3}
        </span>
      </p>
    </div>
  );
}
