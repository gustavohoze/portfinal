import type { ProjectProblem } from "@/types/database";
import styles from "./ProblemSection.module.css";

interface Props {
  problem: ProjectProblem;
}

export default function ProblemSection({ problem }: Props) {
  return (
    <section className={styles.section}>
      <p className="project-section__label">Problem</p>

      {/* Problem statement — featured */}
      <blockquote className={styles.statement}>
        &ldquo;{problem.problem_statement}&rdquo;
      </blockquote>

      {/* Grid of factors */}
      <div className={styles.grid}>
        <div className={styles.item}>
          <h3 className={styles.itemLabel}>User Needs</h3>
          <p className={styles.itemText}>{problem.user_needs}</p>
        </div>
        <div className={styles.item}>
          <h3 className={styles.itemLabel}>Constraints</h3>
          <p className={styles.itemText}>{problem.constraints}</p>
        </div>
        <div className={styles.item}>
          <h3 className={styles.itemLabel}>Internal Factors</h3>
          <p className={styles.itemText}>{problem.internal_factor}</p>
        </div>
        <div className={styles.item}>
          <h3 className={styles.itemLabel}>External Factors</h3>
          <p className={styles.itemText}>{problem.external_factor}</p>
        </div>
      </div>
    </section>
  );
}
