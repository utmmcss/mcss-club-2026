import LinkedIn from "@/components/icons/LinkedIn";
import Social from "@/components/icons/Social";
import styles from "./TeamCard.module.css";

interface TeamCardProps {
  name: string;
  role: string;
  image?: string;
  linkedin?: string;
  social?: string;
}

const linkClass =
  "flex h-11 w-11 items-center justify-center border border-mcss-ink/15 text-mcss-ink transition-colors duration-150 hover:bg-mcss-ink hover:text-mcss-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcss-ink motion-reduce:transition-none";

const TeamCard = ({ name, role, image, linkedin, social }: TeamCardProps) => {
  const words = name.trim().split(/\s+/);
  const initials = (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
  return (
    <article className={styles.card}>
      <div className={styles.frame}>
        <div className={styles.photo}>
          {image ? (
            <img src={image} alt={name} width={400} height={400} loading="lazy" />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">
              {initials}
            </div>
          )}
        </div>
      </div>
      <h3 className="mt-4 text-xl md:text-2xl">{name}</h3>
      <p className="mt-1 font-sub text-xs uppercase tracking-[0.2em] text-muted-foreground">{role}</p>
      <div className="mt-4 flex gap-2">
        {linkedin && (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <span className="sr-only">{name} on LinkedIn</span>
            <LinkedIn className="h-5 w-5" aria-hidden="true" />
          </a>
        )}
        {social && (
          <a href={social} target="_blank" rel="noopener noreferrer" className={linkClass}>
            <span className="sr-only">{name} on social</span>
            <Social className="h-5 w-5" aria-hidden="true" />
          </a>
        )}
      </div>
    </article>
  );
};

export default TeamCard;
