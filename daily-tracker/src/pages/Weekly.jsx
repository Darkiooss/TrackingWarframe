import { useState, useEffect } from "react";
import Card from "../components/Card";
import { getDays } from "../api/tracker";
import { mondayOf, fmtISO, prettyDay } from "../utils/dates";

export default function Weekly() {
    const [days, setDays] = useState({});
    const [weeks, setWeeks] = useState([]);
    const [week, setWeek] = useState("");

    /* charge & garde uniquement les jours avec >0 coche
       mais montrera ensuite la semaine entière */
    useEffect(() => {
        getDays().then((d) => {
            const filtered = Object.fromEntries(
                Object.entries(d).filter(([, payload]) =>
                    Object.values(payload).some(Boolean)
                )
            );
            setDays(filtered);

            const w = Array.from(new Set(Object.keys(filtered).map(mondayOf)))
                .sort()
                .reverse();
            setWeeks(w);
            if (!week && w.length) setWeek(w[0]);
        });
    }, [week]);

    /* plus aucune semaine active */
    if (!week) {
        return (
            <main className="bg-neutral-900 pt-8 px-4 text-white flex justify-center min-h-full">
                <p>Aucune tâche cochée pour l’instant.</p>
            </main>
        );
    }

    /* toutes les dates de la semaine sélectionnée */
    const weekDates = [...Array(7)].map((_, i) => {
        const d = new Date(week);
        d.setDate(d.getDate() + i);
        return d.toISOString().slice(0, 10);
    });

    /* colonnes : toute tâche cochée au moins une fois durant la semaine */
    const cols = Array.from(
        new Set(
            weekDates.flatMap((d) =>
                Object.entries(days[d] ?? {})
                    .filter(([, v]) => v)
                    .map(([id]) => id)
            )
        )
    ).sort();

    const hasData = cols.length > 0; /* une tâche cochée quelque part ? */

    return (
        <main className="bg-neutral-900 pt-8 px-4 text-white min-h-full">
            <section className="w-[80%] max-w-6xl mx-auto space-y-6">
                <h1 className="text-xl font-semibold">Synthèse hebdomadaire</h1>

                <select
                    value={week}
                    onChange={(e) => setWeek(e.target.value)}
                    className="bg-neutral-800 border border-neutral-600 p-2 rounded"
                >
                    {weeks.map((w) => (
                        <option key={w} value={w}>
                            {fmtISO(w)}
                        </option>
                    ))}
                </select>

                {!hasData ? (
                    <Card>
                        <p className="text-center">Aucune donnée pour cette semaine.</p>
                    </Card>
                ) : (
                    <Card>
                        <table className="w-full text-sm border-collapse text-white">
                            <thead>
                                <tr>
                                    <th className="p-2 border border-neutral-700">Jour</th>
                                    {cols.map((id) => (
                                        <th key={id} className="p-2 border border-neutral-700">
                                            {id}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {weekDates.map((d) => (
                                    <tr key={d}>
                                        <td className="p-2 border border-neutral-700">
                                            {prettyDay(d)}
                                        </td>
                                        {cols.map((id) => (
                                            <td
                                                key={id}
                                                className="p-2 border border-neutral-700 text-center"
                                            >
                                                {days[d]?.[id] ? "✔️" : ""}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                )}
            </section>
        </main>
    );
}
