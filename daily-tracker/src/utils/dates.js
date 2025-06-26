export function mondayOf(iso) {
  const d = new Date(iso);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  return d.toISOString().slice(0, 10);
}
export const fmtISO = (iso) =>
  new Intl.DateTimeFormat("fr-FR").format(new Date(iso));
const days = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];
const months = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];
export const prettyDay = (iso) => {
  const d = new Date(iso);
  return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
};
