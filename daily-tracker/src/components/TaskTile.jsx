import { useState } from "react";

export default function TaskTile({
  id,
  label,
  checked,
  onToggle,
  onRemove,
  onReorder,
  cats,        // ← tableau de catégories [{id,name}]
  moveTo       // ← fonction (taskId, newCatId)
}) {
  const [chooser, setChooser] = useState(false);

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", id);
        e.dataTransfer.effectAllowed = "move";
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const dragId = e.dataTransfer.getData("text/plain");
        if (dragId && dragId !== id) onReorder(dragId, id);
      }}
      className="bg-neutral-800 p-4 border border-neutral-700 flex flex-col items-center cursor-grab relative"
    >
      {/* ---------- nom de la tâche ---------- */}
      <span
        className="truncate mb-3 cursor-pointer hover:underline"
        onClick={() => setChooser((v) => !v)}
      >
        {label}
      </span>

      {/* ---------- sélecteur de catégorie ---------- */}
      {chooser && (
        <select
          className="absolute top-2 left-2 right-2 bg-neutral-800 border border-violet-500 rounded px-2 py-1 text-sm"
          onChange={(e) => {
            moveTo(id, e.target.value);
            setChooser(false);
          }}
          onBlur={() => setChooser(false)}
          defaultValue=""
        >
          <option value="" disabled>
            Déplacer vers…
          </option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      )}

      {/* ---------- case à cocher ---------- */}
      <label className="mb-3 inline-flex items-center justify-center cursor-pointer">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={onToggle}
        />
        <span className="h-6 w-6 border-2 border-violet-500 rounded-sm peer-checked:bg-violet-500 flex items-center justify-center">
          {checked && "✔"}
        </span>
      </label>

      {/* ---------- suppression ---------- */}
      <button
        onClick={onRemove}
        className="text-red-400 hover:text-violet-500 text-xs w-5 h-5 rounded-full flex items-center justify-center hover:bg-violet-900/30"
      >
        ×
      </button>
    </div>
  );
}
