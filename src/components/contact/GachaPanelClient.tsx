"use client";

import dynamic from "next/dynamic";

const GachaPanel = dynamic(() => import("@/components/contact/GachaPanel"), {
  ssr: false,
});

export default function GachaPanelClient() {
  return <GachaPanel />;
}
