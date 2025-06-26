// utils/reorder.js
export function reorder(array, fromId, toId) {
  const copy = [...array];
  const fromIdx = copy.findIndex((c) => c.id === fromId);
  const toIdx = copy.findIndex((c) => c.id === toId);
  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return array;
  const [item] = copy.splice(fromIdx, 1);
  copy.splice(toIdx, 0, item);
  return copy;
}
