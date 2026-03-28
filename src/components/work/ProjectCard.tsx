import SafeImage from "@/components/ui/SafeImage";
import type { Project } from "@/types/database";
import TransitionLink from "@/components/ui/TransitionLink";
import styles from "./ProjectCard.module.css";

interface Props {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: Props) {
  const lowerAppUrl = project.check_app_url?.toLowerCase() ?? "";
  const isAppStoreRelease =
    lowerAppUrl.includes("appstore") ||
    lowerAppUrl.includes("apps.apple.com");

  return (
    <TransitionLink
      href={`/work/${project.slug}`}
      className={`${styles.card} ${isAppStoreRelease ? styles.releaseCard : ""}`}
      data-reveal
      aria-label={`View project: ${project.title}`}
    >
      {/* Thumbnail */}
      <div className={styles.thumbnail}>
        {project.thumbnail_url ? (
          <SafeImage
            src={project.thumbnail_url}
            alt={project.title}
            fill
            sizes="(min-width: 1024px) 50vw, 90vw"
            className={styles.image}
            loading="eager"
            priority={index < 2}
          />
        ) : (
          <div className={styles.placeholder} />
        )}
        <div className={styles.overlay} />
      </div>

      {/* Info */}
      <div className={styles.info}>
        <span className={styles.index}>
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className={styles.title}>{project.title}</h3>
        <div className={styles.meta}>
          <span className={`badge ${styles.badge}`}>{project.type}</span>
          {isAppStoreRelease && (
            <span className={`badge ${styles.releaseBadge}`}>App Store Release</span>
          )}
        </div>
        <span className={styles.arrow} aria-hidden="true">→</span>
      </div>
    </TransitionLink>
  );
}
