import card from "../EventCard.module.css";
import styles from "./EventSkeleton.module.css";

const titleWidths = ["55%", "75%", "40%", "65%", "50%"];

// Placeholder rows that mirror EventCard's grid, so nothing jumps when the real rows arrive.
const EventSkeleton = ({ rows = 5, tone = "paper" }: { rows?: number; tone?: "paper" | "ink" }) => (
  <div role="status" aria-label="Loading events" className={`${styles.list} ${styles[tone]}`}>
    {Array.from({ length: rows }, (_, i) => (
      <div key={i} className={`${card.item} ${styles.item}`}>
        <div className={`${card.inner} ${styles.row}`} aria-hidden="true">
          <span className={card.date}>
            <span className={`${styles.bar} h-10 w-12`} />
            <span className={`${styles.bar} mt-2 h-3 w-20`} />
          </span>
          <span className={`${styles.bar} h-6`} style={{ width: titleWidths[i % titleWidths.length] }} />
          <span>
            <span className={`${styles.bar} h-3 w-32`} />
            <span className={`${styles.bar} mt-2 h-3 w-40`} />
          </span>
          <span className={`${card.arrow} ${styles.bar} ml-auto h-3 w-6`} />
        </div>
      </div>
    ))}
  </div>
);

export default EventSkeleton;
