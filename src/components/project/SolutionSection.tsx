import SafeImage from "@/components/ui/SafeImage";
import type {
  ProjectSolution,
  SolutionDeliverable,
  SolutionKeyDecision,
  SolutionProcess,
  SolutionImage,
} from "@/types/database";
import styles from "./SolutionSection.module.css";

interface Props {
  solution: ProjectSolution;
  deliverables: SolutionDeliverable[];
  keyDecisions: SolutionKeyDecision[];
  process: SolutionProcess[];
  images: SolutionImage[];
}

export default function SolutionSection({
  solution,
  deliverables,
  keyDecisions,
  process,
  images,
}: Props) {
  return (
    <section className={styles.section}>
      <p className="project-section__label">Solution</p>

      <div className={styles.inner}>
        {/* Description */}
        {solution.description && (
          <p className={`project-section__text ${styles.desc}`}>
            {solution.description}
          </p>
        )}

        {/* Two columns: deliverables + key decisions */}
        {(deliverables.length > 0 || keyDecisions.length > 0) && (
          <div className={styles.twoCol}>
            {deliverables.length > 0 && (
              <div className={styles.col}>
                <h3 className={styles.colLabel}>Deliverables</h3>
                <ol className={styles.list}>
                  {deliverables.map((d, i) => (
                    <li key={d.id} className={styles.listItem}>
                      <span className={styles.listIndex}>{String(i + 1).padStart(2, "0")}</span>
                      <span>{d.item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
            {keyDecisions.length > 0 && (
              <div className={styles.col}>
                <h3 className={styles.colLabel}>Key Decisions</h3>
                <ol className={styles.list}>
                  {keyDecisions.map((k, i) => (
                    <li key={k.id} className={styles.listItem}>
                      <span className={styles.listIndex}>{String(i + 1).padStart(2, "0")}</span>
                      <span>{k.item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        )}

        {/* Process steps */}
        {process.length > 0 && (
          <div className={styles.process}>
            <h3 className={styles.colLabel}>Process</h3>
            <div className={styles.processSteps}>
              {process.map((step, i) => (
                <div key={step.id} className={styles.step}>
                  <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                  <p className={styles.stepText}>{step.item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Images */}
        {images.length > 0 && (
          <div className={styles.images}>
            {images.map((img) => (
              <div key={img.id} className={styles.imageWrap}>
                <SafeImage
                  src={img.image_url}
                  alt="Solution visual"
                  fill
                  sizes="(min-width: 1024px) 100vw, 90vw"
                  className={styles.image}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
