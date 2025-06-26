import { useEffect, useState } from "react";
import { getAllDays } from "../api/tracker";
import { mondayOf } from "../utils/dates";

export default function useWeek() {
  const [days, setDays] = useState({});
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    (async () => {
      const all = await getAllDays();
      setDays(all);
      setWeeks(
        Array.from(new Set(Object.keys(all).map(mondayOf)))
          .sort()
          .reverse()
      );
    })();
  }, []);

  return { days, weeks };
}
