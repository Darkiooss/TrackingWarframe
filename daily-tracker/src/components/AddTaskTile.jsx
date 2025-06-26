import { useState } from "react";

/* Tuile “+” verte (sans bordure) pour ajouter une tâche */
export default function AddTaskTile({ onAdd }) {
    const [editing, setEditing] = useState(false);
    const [label, setLabel] = useState("");

    if (editing) {
        return (
            <div className="bg-neutral-800 p-4 border border-neutral-700 flex flex-col items-center">
                <input
                    autoFocus
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Nom de la tâche"
                    className="w-full mb-3 text-xs px-2 py-1 rounded bg-neutral-700 border border-neutral-600 text-white"
                />
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            const trimmed = label.trim();
                            if (trimmed) onAdd(trimmed);
                            setLabel("");
                            setEditing(false);
                        }}
                        className="px-3 py-1 bg-lime-600 rounded"
                    >
                        OK
                    </button>
                    <button
                        onClick={() => {
                            setLabel("");
                            setEditing(false);
                        }}
                        className="px-3 py-1 bg-neutral-700 rounded"
                    >
                        ✕
                    </button>
                </div>
            </div>
        );
    }

    /* état “+” */
    return (
        <div
            onClick={() => setEditing(true)}
            className="bg-neutral-800 p-4 flex items-center justify-center cursor-pointer hover:bg-neutral-700 border border-neutral-700"
            title="Nouvelle tâche"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 stroke-lime-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
            </svg>
        </div>
    );
}
