import { useEffect, useState, useCallback } from "react";
import { getCats, addCat, updateCat, deleteCat } from "../api/tracker";

export default function useCategories() {
  const [cats, setCats] = useState([]);

  /* chargement initial */
  useEffect(() => {
    getCats().then(setCats);
  }, []);

  /* créer */
  const create = useCallback(async (name) => {
    const cat = await addCat(name);
    setCats((c) => [...c, cat]);
  }, []);

  /* renommer */
  const rename = useCallback(async (id, name) => {
    const cat = await updateCat(id, name);
    setCats((c) => c.map((k) => (k.id === id ? cat : k)));
  }, []);

  /* supprimer */
  const remove = useCallback(async (id) => {
    await deleteCat(id);
    setCats((c) => c.filter((k) => k.id !== id));
  }, []);

  return { cats, create, rename, remove };
}
