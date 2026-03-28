import type { Metadata } from "next";
import { getAllProjects } from "@/lib/queries";
import ProjectDashboard from "@/components/project/ProjectDashboard";

export const metadata: Metadata = {
  title: "Work | Portfolio",
  description: "Selected projects and case studies.",
};

export const revalidate = 3600;

export default async function WorkPage() {
  const projects = await getAllProjects();

  return (
    <main>
      <ProjectDashboard initialProjects={projects || []} />
    </main>
  );
}
