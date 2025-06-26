import Card from "./Card";
import { useState } from "react";

export default function CategoryBlock({
    id,
    cat,
    onDropTask,
    onRename,            // ← nouveau
    children
}) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(cat.name);
    const [over, setOver] = useState(false);

    /* ---------- drag-and-drop entre catégories ---------- */
    function handleDrop(e) {
        const taskId = e.dataTransfer.getData("text/plain");
        if (taskId) onDropTask(taskId, id);
        setOver(false);
    }

    /* ---------- rendu ---------- */
    return (
        <Card
            className={`w-full transition ring-2 ring-violet-400/70 ${over ? "ring-opacity-100" : "ring-opacity-0"
                }`}
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={() => setOver(true)}
            onDragLeave={() => setOver(false)}
            onDrop={handleDrop}
        >
            {/* ---------- entête ---------- */}
            {editing ? (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (name.trim()) onRename(id, name.trim());
                        setEditing(false);
                    }}
                    className="mb-4"
                >
                    <input
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={() => setEditing(false)}
                        className="bg-neutral-800 border border-neutral-700 px-2 py-1 rounded w-full"
                    />
                </form>
            ) : (
                <h3
                    className="mb-4 text-lg font-semibold cursor-pointer hover:underline"
                    onClick={() => setEditing(true)}
                >
                    {cat.name}
                </h3>
            )}

            {children}
        </Card>
    );
}
