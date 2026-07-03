import React from "react";

export default function PandaSparkles({ show = false }) {
  if (!show) return null;

  return (
    <>
      <div className="absolute left-4 top-2 size-3 rotate-45 rounded-sm bg-amber-300" />
      <div className="absolute right-6 top-5 size-2 rotate-45 rounded-sm bg-pink-300" />
      <div className="absolute right-12 top-0 size-2 rotate-45 rounded-sm bg-emerald-300" />
    </>
  );
}
