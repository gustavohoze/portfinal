import type { ProjectChallenge } from "@/types/database";
import styles from "./ChallengeSection.module.css";

interface Props {
  challenge: ProjectChallenge;
}

export default function ChallengeSection({ challenge }: Props) {
  return (
    <section className={styles.section}>
      <div className="project-two-col">
        {/* Left */}
        <div>
          <p className="project-section__label">Challenge</p>
          <div className={styles.stat}>
            <span className={styles.statNum}>{challenge.timeline_days}</span>
            <span className={styles.statLabel}>days</span>
          </div>
          {challenge.role_summary && (
            <p className={styles.role}>{challenge.role_summary}</p>
          )}
        </div>

        {/* Right */}
        <div className={styles.right}>
          <p className="project-section__text">{challenge.overview}</p>
          {challenge.contribution && (
            <div className={styles.contribution}>
              <span className={styles.contribLabel}>My contribution</span>
              <p className="project-section__text">{challenge.contribution}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
