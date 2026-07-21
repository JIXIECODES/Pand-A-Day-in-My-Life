import React from "react";

const leafPaths = [
  "M35 43c-13-12-26-11-28-10 5 13 16 18 28 10Z",
  "M39 31c5-15 16-21 19-21 1 13-6 22-19 21Z",
  "M54 67c12-10 24-8 27-6-7 12-17 15-27 6Z",
  "M28 74C15 65 4 68 2 70c8 10 18 12 26 4Z",
];

export default function BambooDecoration({ className = "", variant = "sprig" }) {
  if (variant === "divider") {
    return (
      <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 240 32">
        <path d="M26 16h188" stroke="currentColor" strokeLinecap="round" strokeWidth="2" opacity=".25" />
        <path d="M111 17c-12-11-21-8-23-6 6 9 14 11 23 6Zm18-2c10-10 19-8 21-6-5 9-13 11-21 6Z" fill="currentColor" opacity=".58" />
        <circle cx="120" cy="16" r="3" fill="currentColor" opacity=".72" />
      </svg>
    );
  }

  if (variant === "cluster") {
    return (
      <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 150 210">
        <g stroke="currentColor" strokeLinecap="round">
          <path d="M38 205 54 18M80 205 88 6M116 205 108 45" strokeWidth="11" />
          <path d="m42 158 10 1m-8-47 12 1m-8-48 12 1m23 92 10 .4m-8-50 11 .5m-7-51 11 .4m17 110 10-.5m-8-47 10-.5m-6-44 9-.4" stroke="#f7fee7" strokeWidth="3" opacity=".75" />
          <path d="M51 70C28 58 18 68 14 74c15 8 27 6 37-4Zm4-22c9-22 26-25 32-23-5 17-16 26-32 23Zm32 67c-20-16-35-8-39-2 14 11 27 12 39 2Zm5-31c9-21 25-23 31-20-5 16-16 23-31 20Zm17 61c16-16 31-12 36-7-11 13-24 16-36 7Zm-1-31c-18-12-31-5-35 1 13 9 25 9 35-1Z" fill="currentColor" strokeWidth="2" />
        </g>
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 88 88">
      <path d="M44 84C43 62 42 40 48 13" stroke="currentColor" strokeLinecap="round" strokeWidth="5" />
      <g fill="currentColor">{leafPaths.map((path) => <path d={path} key={path} />)}</g>
    </svg>
  );
}
