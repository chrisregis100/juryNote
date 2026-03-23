import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { getLiveRankingForPresident } from "@/server/actions/deliberation";
import { CloseDeliberationButton } from "./close-deliberation-button";

export default async function JuryDeliberationPage() {
  const session = await getServerSession();
  if (!session?.user || !("eventId" in session.user)) redirect("/jury");
  if (!session.user.isPresident) redirect("/jury");

  const eventId = session.user.eventId;

  const result = await getLiveRankingForPresident(eventId);
  if (!result.data) redirect("/jury");

  const { ranking, juryStatuses, isLocked } = result.data;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
          Président de jury
        </p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-black md:text-3xl">
          Délibération
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Suivez l&apos;avancement des soumissions et consultez le classement en direct.
        </p>
      </div>

      {isLocked && (
        <div className="rounded-xl border-2 border-black bg-amber-50 p-4 text-sm font-medium text-amber-900 shadow-[4px_4px_0_0_#000]">
          La délibération est clôturée. Le classement est définitif.
        </div>
      )}

      <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
        <h2 className="mb-4 text-base font-bold text-black">État des jurys</h2>
        {juryStatuses.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">
            Aucun jury enregistré.
          </p>
        ) : (
          <ul className="space-y-2">
            {juryStatuses.map((j) => (
              <li
                key={j.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              >
                <span className="font-medium text-black">
                  {j.displayName ?? "Jury sans nom"}
                </span>
                {j.submittedAt ? (
                  <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                    Soumis
                  </span>
                ) : (
                  <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-700">
                    En attente
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0_0_#000]">
        <h2 className="mb-4 text-base font-bold text-black">Classement en direct</h2>
        {ranking.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-500">
            Aucune note enregistrée pour l&apos;instant.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-black text-left">
                <th className="pb-2 pr-4 font-bold">#</th>
                <th className="pb-2 font-bold">Équipe</th>
                <th className="pb-2 text-right font-bold">Score</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((r) => (
                <tr key={r.teamId} className="border-b border-slate-100 last:border-0">
                  <td className="py-2 pr-4 font-mono font-bold text-slate-500">{r.rank}</td>
                  <td className="py-2 font-medium text-black">{r.teamName}</td>
                  <td className="py-2 text-right font-mono font-bold text-indigo-700">
                    {r.score.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {!isLocked && <CloseDeliberationButton eventId={eventId} />}
    </div>
  );
}
