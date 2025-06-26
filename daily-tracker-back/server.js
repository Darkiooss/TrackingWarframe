import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "data.json");
const PORT = 3001;

const app = express();
app.use(cors());
app.use(express.json());

/* helpers -------------------------------------------------------------- */
async function load() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const db = JSON.parse(raw);

    /* migrations */
    if (!db.categories)
      db.categories = [{ id: "cat-default", name: "Général" }];
    if (db.columns && typeof db.columns[0] === "string") {
      db.columns = db.columns.map((id) => ({ id, cat: "cat-default" }));
    }
    return db;
  } catch {
    return {
      categories: [{ id: "cat-default", name: "Général" }],
      columns: [],
      days: {},
    };
  }
}
const save = (db) =>
  fs.writeFile(DATA_FILE, JSON.stringify(db, null, 2), "utf-8");

/* --- catégories ------------------------------------------------------- */
app.get("/categories", async (_req, res) =>
  res.json((await load()).categories)
);

app.post("/categories", async (req, res) => {
  const db = await load();
  const cat = {
    id: `cat-${Date.now()}`,
    name: (req.body.name || "Sans nom").trim(),
  };
  db.categories.push(cat);
  await save(db);
  res.status(201).json(cat);
});

app.patch("/categories/:id", async (req, res) => {
  const db = await load();
  const cat = db.categories.find((c) => c.id === req.params.id);
  if (!cat) return res.status(404).json({ error: "Catégorie introuvable" });
  const newName = (req.body.name || "").trim();
  if (!newName) return res.status(400).json({ error: "Nom invalide" });
  cat.name = newName;
  await save(db);
  res.json(cat);
});

/* supprimer une catégorie */
app.delete("/categories/:id", async (req, res) => {
  if (req.params.id === "cat-default")
    return res
      .status(400)
      .json({ error: "Impossible de supprimer la catégorie par défaut" });

  const db = await load();
  if (!db.categories.some((c) => c.id === req.params.id))
    return res.status(404).json({ error: "Catégorie introuvable" });

  db.categories = db.categories.filter((c) => c.id !== req.params.id);

  /* toute colonne pointant vers cette catégorie -> cat-default */
  db.columns = db.columns.map((col) =>
    col.cat === req.params.id ? { ...col, cat: "cat-default" } : col
  );
  await save(db);
  res.sendStatus(204);
});

/* --- colonnes & jours (inchangés) ------------------------------------ */
app.get("/init/:date", async (req, res) => {
  const db = await load();
  res.json({
    columns: db.columns,
    payload: db.days[req.params.date] ?? {},
  });
});
app.put("/columns", async (req, res) => {
  const db = await load();
  db.columns = req.body;
  await save(db);
  res.sendStatus(204);
});
app.put("/day/:date", async (req, res) => {
  const db = await load();
  db.days[req.params.date] = req.body;
  await save(db);
  res.sendStatus(204);
});
app.get("/days", async (_req, res) => res.json((await load()).days));

/* -------------------------------------------------------------------- */
app.listen(PORT, () => console.log(`API ➜ http://localhost:${PORT}`));
