import { Suspense } from "react";
import { getAllProjects } from "@/lib/queries";
import HeroSection from "@/components/home/HeroSection";
import WorkSection from "@/components/home/WorkSection";

export const revalidate = 3600;

export default async function HomePage() {
  const allProjects = await getAllProjects();
  
  // Filter for projects that have an App Store link, then limit to 2
  const projects = allProjects
    .filter((p) => p.check_app_url && p.check_app_url.includes("apps.apple.com"))
    .slice(0, 2);

  return (
    <>
      {/* Hero — client component, Three.js canvas */}
      <HeroSection />

      {/* Work grid */}
      <WorkSection projects={projects} />

    </>
  );
}
