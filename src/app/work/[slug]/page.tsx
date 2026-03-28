import type { Metadata } from "next";
import SafeImage from "@/components/ui/SafeImage";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjectSlugs, getAdjacentProjects } from "@/lib/queries";
import TransitionLink from "@/components/ui/TransitionLink";
import ChallengeSection from "@/components/project/ChallengeSection";
import ProblemSection from "@/components/project/ProblemSection";
import SolutionSection from "@/components/project/SolutionSection";
import ImpactSection from "@/components/project/ImpactSection";
import ContributorsSection from "@/components/project/ContributorsSection";
import DeckCarousel from "@/components/project/DeckCarousel";
import ProjectNav from "@/components/project/ProjectNav";
import ProjectFooterNav from "@/components/project/ProjectFooterNav";
import styles from "./page.module.css";

interface Params {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.challenge?.overview ?? "Project case study.",
  };
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const revalidate = 3600;

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const [project, adjacent] = await Promise.all([
    getProjectBySlug(slug),
    getAdjacentProjects(slug),
  ]);

  if (!project) notFound();

  const appUrl = project.check_app_url?.trim() ?? "";
  const lowerAppUrl = appUrl.toLowerCase();
  const isGithubUrl = lowerAppUrl.includes("github");
  const isAppStoreRelease = lowerAppUrl.includes("appstore");
  const shouldShowCheckApp = Boolean(appUrl) && !isGithubUrl;

  const sections = [
    project.challenge && { id: "challenge", label: "Challenge" },
    project.problem && { id: "problem", label: "Problem" },
    project.solution && { id: "solution", label: "Solution" },
    project.impact && { id: "impact", label: "Impact" },
    project.contributors.length > 0 && { id: "contributors", label: "Team" },
  ].filter(Boolean) as { id: string; label: string }[];

  return (
    <article className={styles.page}>
      <div className="container">
        {/* Header */}
        <div className={styles.hero}>
          <TransitionLink href="/work" className={styles.back}>← Projects</TransitionLink>
          <div className={styles.heroMeta}>
            <span className="badge">{project.type}</span>
            {isAppStoreRelease && (
              <span className={`badge ${styles.releaseBadge}`}>App Store Release</span>
            )}
            {shouldShowCheckApp && (
              <a
                href={appUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.checkAppLink}
              >
                Check App ↗
              </a>
            )}
          </div>
          <h1 className={styles.headline}>{project.title}</h1>

          {project.thumbnail_url && (
            <div className={styles.thumbnail}>
              <SafeImage
                src={project.thumbnail_url}
                alt={project.title}
                fill
                sizes="100vw"
                priority
                className={styles.thumbnailImg}
              />
            </div>
          )}
        </div>
      </div>

      {/* Full-bleed wrapper to vertically bound the sticky nav */}
      <div className={styles.bodyWrapper}>
        <div className={styles.navAnchor}>
          <ProjectNav sections={sections} />
        </div>

        <div className="container">
          <div className={styles.content}>
            {project.challenge && (
              <div id="challenge"><ChallengeSection challenge={project.challenge} /></div>
            )}
            {project.problem && (
              <div id="problem"><ProblemSection problem={project.problem} /></div>
            )}
            {project.solution && (
              <div id="solution">
                <SolutionSection
                  solution={project.solution}
                  deliverables={project.solution_deliverables}
                  keyDecisions={project.solution_key_decisions}
                  process={project.solution_process}
                  images={project.solution_images}
                />
              </div>
            )}
            {project.impact && (
              <div id="impact"><ImpactSection impact={project.impact} /></div>
            )}
            {project.contributors.length > 0 && (
              <div id="contributors">
                <ContributorsSection contributors={project.contributors} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deck carousel — full bleed */}
      {project.deck_images.length > 0 && (
        <DeckCarousel images={project.deck_images} />
      )}

      {/* Bottom prev/next project navigation */}
      <ProjectFooterNav prev={adjacent.prev} next={adjacent.next} />
    </article>
  );
}
