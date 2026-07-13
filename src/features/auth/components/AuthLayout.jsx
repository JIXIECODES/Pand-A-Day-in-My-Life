import React, { useEffect } from "react";
import PandaAuthGraphic from "./PandaAuthGraphic.jsx";

export default function AuthLayout({ children, eyebrow, title }) {
  useEffect(() => {
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
    };
  }, []);

  return (
    <main className="h-screen h-dvh overflow-hidden bg-[linear-gradient(135deg,#fff8ed_0%,#ecfdf3_52%,#fdf2f8_100%)] px-4 py-4 text-zinc-900 sm:py-6">
      <section className="mx-auto flex h-full min-h-0 max-w-5xl items-center justify-center">
        <div className="grid h-full max-h-full min-h-0 w-full grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 shadow-2xl shadow-emerald-100/70 backdrop-blur lg:h-auto lg:grid-rows-none lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex min-h-0 flex-col justify-center bg-emerald-50/70 p-5 text-center sm:p-6 lg:p-8">
            <PandaAuthGraphic />
            {eyebrow && <p className="mt-4 text-sm font-black uppercase text-emerald-700">{eyebrow}</p>}
            <h1 className="mt-2 text-3xl font-black text-zinc-950 sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm font-bold leading-6 text-zinc-500">
              Save your cozy routine locally, or continue as a guest and keep planning your day.
            </p>
          </div>
          <div className="min-h-0 overflow-y-auto p-6 sm:p-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
