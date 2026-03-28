import SafeImage from "@/components/ui/SafeImage";
import type { ProjectImpact } from "@/types/database";
import styles from "./ImpactSection.module.css";

interface Props {
  impact: ProjectImpact;
}

export default function ImpactSection({ impact }: Props) {
  return (
    <section className={styles.section}>
      <p className="project-section__label">Impact</p>
      <div className={styles.inner}>
        <p className={`project-section__text ${styles.results}`}>{impact.results}</p>
        {impact.impact_image_url && (
          <div className={styles.imageWrap}>
            <SafeImage
              src={impact.impact_image_url}
              alt="Impact visual"
              fill
              sizes="(min-width: 1024px) 60vw, 90vw"
              className={styles.image}
            />
          </div>
        )}
      </div>
    </section>
  );
}
