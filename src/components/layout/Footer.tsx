import styles from "./Footer.module.css";

const SOCIAL_LINKS = [
  { href: "mailto:gustavohoze@gmail.com", label: "Email" },
  { href: "https://github.com/gustavohoze", label: "GitHub" },
  { href: "https://www.linkedin.com/in/gustavo-hoze/", label: "LinkedIn" },
  { href: "https://wa.me/6285104937022", label: "WhatsApp" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <p className={styles.copy}>© {year}</p>
        <nav className={styles.social} aria-label="Social links">
          {SOCIAL_LINKS.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              data-cursor-hover
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
