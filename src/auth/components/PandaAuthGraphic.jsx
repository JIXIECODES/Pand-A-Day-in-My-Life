import React from "react";
import PandaAvatar from "../../components/panda/PandaAvatar.jsx";

export default function PandaAuthGraphic() {
  return (
    <div className="relative mx-auto grid h-44 w-48 place-items-center" aria-label="Minimal panda illustration" role="img">
      <PandaAvatar mood="happy" size="large" />
      <div className="absolute left-0 top-6 h-12 w-2 -rotate-12 rounded-full bg-emerald-400" />
      <div className="absolute -left-4 top-6 h-5 w-9 -rotate-12 rounded-full bg-emerald-200" />
      <div className="absolute left-2 top-12 h-5 w-9 rotate-12 rounded-full bg-emerald-200" />
      <div className="absolute right-0 top-2 size-3 rounded-full bg-pink-200" />
      <div className="absolute right-8 top-0 size-2 rounded-full bg-amber-200" />
      <div className="absolute left-8 top-0 size-2 rounded-full bg-sky-200" />
    </div>
  );
}
