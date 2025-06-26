const API = "http://localhost:3001";

async function fetchJSON(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.status !== 204 ? res.json() : undefined;
}

/* ---------- journées & colonnes ---------- */
export const getInit = (d) => fetchJSON(`/init/${d}`);
export const saveColumns = (cols) =>
  fetchJSON("/columns", { method: "PUT", body: JSON.stringify(cols) });
export const saveDay = (d, p) =>
  fetchJSON(`/day/${d}`, { method: "PUT", body: JSON.stringify(p) });
export const getDays = () => fetchJSON("/days");

/* ---------- catégories ---------- */
export const getCats = () => fetchJSON("/categories");
export const addCat = (name) =>
  fetchJSON("/categories", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
export const updateCat = (id, name) =>
  fetchJSON(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
export const deleteCat = (id) =>
  fetchJSON(`/categories/${id}`, { method: "DELETE" });
