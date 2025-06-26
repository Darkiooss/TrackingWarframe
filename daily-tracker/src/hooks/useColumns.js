import { useEffect, useState, useCallback } from "react";
import { getInit, saveColumns, saveDay } from "../api/tracker";
import { reorder } from "../utils/reorder";

const DEFAULT_CAT = "cat-default"; // doit exister côté backend

function normalize(list) {
  return list.map((c) =>
    typeof c === "string" ? { id: c, cat: DEFAULT_CAT } : c
  );
}

export default function useColumns(dateISO) {
  const [cols, setCols] = useState([]);
  const [payload, setPay] = useState({});

  /* chargement initial -------------------------------------------------- */
  useEffect(() => {
    getInit(dateISO).then(({ columns, payload }) => {
      setCols(normalize(columns));
      setPay(payload);
    });
  }, [dateISO]);

  /* helpers de persistance --------------------------------------------- */
  const persistCols = useCallback(async (next) => {
    const norm = normalize(next);
    setCols(norm);
    await saveColumns(norm);
  }, []);

  const persistPay = useCallback(
    async (next) => {
      setPay(next);
      await saveDay(dateISO, next);
    },
    [dateISO]
  );

  /* actions ------------------------------------------------------------- */
  const toggle = (id) => persistPay({ ...payload, [id]: !payload[id] });
  const add = (id, cat) =>
    !cols.find((c) => c.id === id) && persistCols([...cols, { id, cat }]);
  const remove = (id) => persistCols(cols.filter((c) => c.id !== id));
  const moveTo = (id, newCat) =>
    persistCols(cols.map((c) => (c.id === id ? { ...c, cat: newCat } : c)));

  const reorderInCat = (dragId, overId) => {
    const cat = cols.find((c) => c.id === dragId)?.cat;
    if (!cat) return;
    const ordered = reorder(
      cols.filter((c) => c.cat === cat),
      dragId,
      overId
    );
    persistCols([...cols.filter((c) => c.cat !== cat), ...ordered]);
  };

  return { cols, payload, toggle, add, remove, moveTo, reorderInCat };
}
