import React from "react";
import PandaAuthGraphic from "./PandaAuthGraphic.jsx";

export default function AuthLayout({ children, eyebrow, title }) {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fff8ed_0%,#ecfdf3_52%,#fdf2f8_100%)] px-4 py-8 text-zinc-900">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-white/80 bg-white/75 shadow-2xl shadow-emerald-100/70 backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center bg-emerald-50/70 p-8 text-center">
            <PandaAuthGraphic />
            <p className="mt-4 text-sm font-black uppercase text-emerald-700">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-black text-zinc-950 sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm font-bold leading-6 text-zinc-500">
              Save your cozy routine locally, or continue as a guest and keep planning your day.
            </p>
          </div>
          <div className="p-6 sm:p-8">{children}</div>
        </div>
      </section>
    </main>
  );
}
