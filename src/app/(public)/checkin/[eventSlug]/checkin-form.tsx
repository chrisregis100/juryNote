"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CustomQuestion } from "@prisma/client";
import { findInvitedParticipant, checkinParticipant } from "@/server/actions/checkin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface CheckinFormProps {
  eventId: string;
  eventName: string;
  customQuestions: CustomQuestion[];
}

type Step = "name" | "info" | "questions" | "confirm" | "success";

export function CheckinForm({ eventId, eventName, customQuestions }: CheckinFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("name");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Name
  const [name, setName] = useState("");
  const [invitedParticipant, setInvitedParticipant] = useState<{ id: string; email?: string | null; phone?: string | null; profession?: string | null } | null>(null);

  // Step 2: Info
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("");
  const [photoConsent, setPhotoConsent] = useState(false);

  // Step 3: Questions
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
    } catch (err) {
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

    if (customQuestions.length > 0) {
      setStep("questions");
    } else {
      setStep("confirm");
    }
  };

  const handleQuestionsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required questions
    const requiredQuestions = customQuestions.filter((q) => q.isRequired);
    for (const q of requiredQuestions) {
      if (!answers[q.id] || answers[q.id].trim() === "") {
        setError(`La question "${q.label}" est obligatoire`);
        return;
      }
    }
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
    } catch (err) {
      setError("Erreur lors de l'enregistrement. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  if (step === "success") {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="mb-4 text-4xl">✓</div>
            <h2 className="mb-2 text-xl font-semibold text-green-600">Enregistrement réussi !</h2>
            <p className="mb-4 text-slate-600">
              Merci {name}, votre présence a été enregistrée pour l'événement <strong>{eventName}</strong>.
            </p>
            <Button onClick={() => router.push("/")} variant="outline">
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4 flex items-center justify-center gap-2">
          {["name", "info", "questions", "confirm"].map((s, idx) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  step === s
                    ? "bg-indigo-600 text-white"
                    : ["name", "info", "questions", "confirm"].indexOf(step) > idx
                      ? "bg-green-500 text-white"
                      : "bg-slate-200 text-slate-600"
                }`}
              >
                {idx + 1}
              </div>
              {idx < 3 && (
                <div
                  className={`h-1 w-8 ${
                    ["name", "info", "questions", "confirm"].indexOf(step) > idx ? "bg-green-500" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>
        )}

        {step === "name" && (
          <form onSubmit={handleNameSearch} className="space-y-4">
            <div>
              <Label htmlFor="name">Entrez votre nom</Label>
              <Input
                id="name"
                placeholder="Votre nom complet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Recherche..." : "Rechercher"}
            </Button>
          </form>
        )}

        {step === "info" && (
          <form onSubmit={handleInfoSubmit} className="space-y-4">
            {invitedParticipant && (
              <div className="rounded bg-green-50 p-3 text-sm text-green-800">
                ✓ Vous êtes dans la liste des invités
              </div>
            )}
            {!invitedParticipant && (
              <div className="rounded bg-orange-50 p-3 text-sm text-orange-800">
                ⚠ Vous n'êtes pas dans la liste des invités, mais vous pouvez quand même vous enregistrer.
              </div>
            )}

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Téléphone *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="profession">Profession *</Label>
              <Input
                id="profession"
                placeholder="Développeur, Designer, etc."
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="photoConsent"
                checked={photoConsent}
                onChange={(e) => setPhotoConsent(e.target.checked)}
                required
              />
              <Label htmlFor="photoConsent" className="cursor-pointer">
                J'accepte que des photos soient prises pendant l'événement *
              </Label>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("name")} className="flex-1">
                Retour
              </Button>
              <Button type="submit" className="flex-1">
                Suivant
              </Button>
            </div>
          </form>
        )}

        {step === "questions" && (
          <form onSubmit={handleQuestionsSubmit} className="space-y-4">
            {customQuestions.map((question) => {
              let optionsArray: string[] = [];
              try {
                optionsArray = question.options ? JSON.parse(question.options) : [];
              } catch {
                optionsArray = [];
              }

              return (
                <div key={question.id}>
                  <Label htmlFor={`q-${question.id}`}>
                    {question.label} {question.isRequired && "*"}
                  </Label>
                  {question.type === "TEXT" && (
                    <Input
                      id={`q-${question.id}`}
                      value={answers[question.id] || ""}
                      onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                      required={question.isRequired}
                    />
                  )}
                  {question.type === "MULTIPLE_CHOICE" && (
                    <select
                      id={`q-${question.id}`}
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
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
                    </select>
                  )}
                  {question.type === "YES_NO" && (
                    <select
                      id={`q-${question.id}`}
                      className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                      value={answers[question.id] || ""}
                      onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                      required={question.isRequired}
                    >
                      <option value="">Sélectionnez</option>
                      <option value="oui">Oui</option>
                      <option value="non">Non</option>
                    </select>
                  )}
                  {question.type === "DATE" && (
                    <Input
                      id={`q-${question.id}`}
                      type="date"
                      value={answers[question.id] || ""}
                      onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                      required={question.isRequired}
                    />
                  )}
                  {question.type === "NUMBER" && (
                    <Input
                      id={`q-${question.id}`}
                      type="number"
                      value={answers[question.id] || ""}
                      onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                      required={question.isRequired}
                    />
                  )}
                </div>
              );
            })}

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("info")} className="flex-1">
                Retour
              </Button>
              <Button type="submit" className="flex-1">
                Suivant
              </Button>
            </div>
          </form>
        )}

        {step === "confirm" && (
          <div className="space-y-4">
            <h3 className="font-semibold">Vérifiez vos informations</h3>
            <div className="space-y-2 rounded bg-slate-50 p-4 text-sm">
              <div>
                <span className="font-medium">Nom:</span> {name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {email}
              </div>
              <div>
                <span className="font-medium">Téléphone:</span> {phone}
              </div>
              <div>
                <span className="font-medium">Profession:</span> {profession}
              </div>
              <div>
                <span className="font-medium">Consentement photo:</span> {photoConsent ? "Oui" : "Non"}
              </div>
              {customQuestions.length > 0 && (
                <div className="mt-4 border-t pt-4">
                  <div className="font-medium mb-2">Réponses aux questions:</div>
                  {customQuestions.map((q) => {
                    const answer = answers[q.id];
                    let displayValue = answer || "-";
                    if (q.type === "YES_NO") {
                      displayValue = answer === "oui" ? "Oui" : answer === "non" ? "Non" : "-";
                    }
                    return (
                      <div key={q.id} className="text-xs">
                        <span className="font-medium">{q.label}:</span> {displayValue}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(customQuestions.length > 0 ? "questions" : "info")}
                className="flex-1"
              >
                Retour
              </Button>
              <Button type="button" onClick={handleFinalSubmit} className="flex-1" disabled={isLoading}>
                {isLoading ? "Enregistrement..." : "Confirmer"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
