import type { ProjectContributor } from "@/types/database";
import styles from "./ContributorsSection.module.css";

interface Props {
  contributors: ProjectContributor[];
}

export default function ContributorsSection({ contributors }: Props) {
  return (
    <section className={styles.section}>
      <p className="project-section__label">Team</p>
      <ul className={styles.list}>
        {contributors.map((c) => (
          <li key={c.id} className={styles.item}>
            <span className={styles.name}>{c.name}</span>
            <span className={styles.role}>{c.role}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
