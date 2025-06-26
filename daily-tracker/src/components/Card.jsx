import React from "react";

// Card — unified dark style
// Base classes give a calm, high‑contrast surface; additional classes can be merged via props.

export default function Card({ children, className = "" }) {
    const base = "w-full bg-neutral-800 text-white rounded-2xl shadow-xl border border-neutral-700 p-6";
    return <div className={`${base} ${className}`}>{children}</div>;
}
