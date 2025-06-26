import { useEffect, useState } from "react";
import { fmtISO } from "../utils/dates";
import Card from "../components/Card";
import CategoryBlock from "../components/CategoryBlock";
import TaskTile from "../components/TaskTile";
import AddTaskTile from "../components/AddTaskTile";
import useCategories from "../hooks/useCategories";
import useColumns from "../hooks/useColumns";

const todayISO = () => new Date().toISOString().slice(0, 10);

export default function DailyTracker() {
    const today = todayISO();

    /* ------------------ catégories ------------------ */
    const { cats, create: createCat, rename: renameCat, remove: removeCat } =
        useCategories();

    const [currentCat, setCurrentCat] = useState(null);
    useEffect(() => {
        if (!currentCat && cats.length) setCurrentCat(cats[0].id);
        if (currentCat && !cats.some((c) => c.id === currentCat))
            setCurrentCat(cats[0]?.id ?? null);
    }, [cats, currentCat]);

    /* ------------------ colonnes / tâches ------------------ */
    const {
        cols,
        payload,
        toggle,
        add,
        remove,
        moveTo,
        reorderInCat,
    } = useColumns(today);

    /* ------------------ ajout de catégorie ------------------ */
    const [addingCat, setAddingCat] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const handleAddCat = () => {
        const trimmed = newCatName.trim();
        if (trimmed) createCat(trimmed);
        setAddingCat(false);
        setNewCatName("");
    };

    /* ------------------ rendu ------------------ */
    return (
        <main className="bg-neutral-900 pt-8 px-4 text-white min-h-full">
            <section className="w-[80%] max-w-6xl mx-auto space-y-8">
                {/* ---------- entête ---------- */}
                <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-2xl font-semibold">{fmtISO(today)}</h2>

                    <div className="flex items-center gap-3">
                        {/* sélecteur de catégorie */}
                        <select
                            value={currentCat || ""}
                            onChange={(e) => setCurrentCat(e.target.value)}
                            className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2"
                        >
                            {cats.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        {/* + catégorie */}
                        {addingCat ? (
                            <div className="flex items-center gap-2">
                                <input
                                    autoFocus
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddCat()}
                                    placeholder="Nom"
                                    className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1"
                                />
                                <button
                                    onClick={handleAddCat}
                                    className="p-2 bg-lime-600 rounded"
                                >
                                    OK
                                </button>
                                <button
                                    onClick={() => {
                                        setAddingCat(false);
                                        setNewCatName("");
                                    }}
                                    className="p-2 bg-neutral-700 rounded"
                                >
                                    ✕
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setAddingCat(true)}
                                className="p-2 bg-neutral-800 rounded hover:bg-neutral-700"
                                title="Nouvelle catégorie"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 stroke-lime-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
                                </svg>
                            </button>
                        )}

                        {/* poubelle catégorie */}
                        {currentCat && currentCat !== "cat-default" && (
                            <button
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            "Supprimer cette catégorie ? Les tâches passeront dans “Général”."
                                        )
                                    )
                                        removeCat(currentCat);
                                }}
                                className="p-2 bg-neutral-800 rounded hover:bg-neutral-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-6 h-6 stroke-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 7L17 19H7L5 7m5-3h4m-4 0V4a1 1 0 011-1h2a1 1 0 011 1v0m-4 0h4"
                                    />
                                </svg>
                            </button>
                        )}
                    </div>
                </Card>

                {/* ---------- bloc catégorie ---------- */}
                {cats
                    .filter((cat) => cat.id === currentCat)
                    .map((cat) => (
                        <CategoryBlock
                            key={cat.id}
                            id={cat.id}
                            cat={cat}
                            onDropTask={moveTo}
                            onRename={renameCat}
                        >
                            <div
                                className="w-full grid gap-px bg-neutral-700
                           grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                           lg:grid-cols-5 xl:grid-cols-6"
                                onDragOver={(e) => e.preventDefault()}
                            >
                                {cols
                                    .filter((c) => c.cat === cat.id)
                                    .map((c) => (
                                        <TaskTile
                                            key={c.id}
                                            id={c.id}
                                            label={c.id}
                                            checked={!!payload[c.id]}
                                            onToggle={() => toggle(c.id)}
                                            onRemove={() => remove(c.id)}
                                            onReorder={reorderInCat}
                                            cats={cats}
                                            moveTo={moveTo}
                                        />
                                    ))}

                                <AddTaskTile onAdd={(label) => add(label, cat.id)} />
                            </div>
                        </CategoryBlock>
                    ))}
            </section>
        </main>
    );
}
