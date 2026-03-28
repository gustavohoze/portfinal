"use client";

import dynamic from "next/dynamic";

const GlobalCanvas = dynamic(() => import("./GlobalCanvas"), {
  ssr: false,
});

export default function GlobalCanvasWrapper() {
  return <GlobalCanvas />;
}
