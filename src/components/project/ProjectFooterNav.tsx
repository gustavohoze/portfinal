import SafeImage from "@/components/ui/SafeImage";
import TransitionLink from "@/components/ui/TransitionLink";
import type { Project } from "@/types/database";
import styles from "./ProjectFooterNav.module.css";

type AdjacentProject = Pick<Project, "slug" | "title" | "thumbnail_url">;

interface Props {
  prev: AdjacentProject | null;
  next: AdjacentProject | null;
}

function ProjectNavCard({
  project,
  direction,
}: {
  project: AdjacentProject;
  direction: "prev" | "next";
}) {
  return (
    <TransitionLink href={`/work/${project.slug}`} className={`${styles.card} ${styles[direction]}`}>
      {project.thumbnail_url && (
        <div className={styles.thumb}>
          <SafeImage
            src={project.thumbnail_url}
            alt={project.title}
            fill
            sizes="120px"
            className={styles.thumbImg}
          />
        </div>
      )}
      <div className={styles.info}>
        <span className={styles.label}>
          {direction === "prev" ? "← Previous" : "Next →"}
        </span>
        <span className={styles.title}>{project.title}</span>
      </div>
    </TransitionLink>
  );
}

export default function ProjectFooterNav({ prev, next }: Props) {
  if (!prev && !next) return null;

  return (
    <nav className={styles.nav} aria-label="Adjacent projects">
      <div className={styles.inner}>
        {prev ? <ProjectNavCard project={prev} direction="prev" /> : <div />}
        {next ? <ProjectNavCard project={next} direction="next" /> : <div />}
      </div>
    </nav>
  );
}
