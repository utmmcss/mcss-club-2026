import { useEffect, useRef, useState, type ComponentProps } from "react";
import TeamCard from "@/components/TeamCard";
import styles from "./TeamGallery.module.css";

type Member = ComponentProps<typeof TeamCard>;

// Cards drift right to left in a loop. The list is rendered twice so the track can wrap seamlessly;
// the copy is inert (React 18 only passes inert through as a string) so screen readers and keyboard users only meet each person once.
export default function TeamGallery({ members, secondsPerCard = 4 }: { members: Member[]; secondsPerCard?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Only animate while the gallery is on screen, so it costs nothing once scrolled past.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const row = (copy: boolean) => (
    <ul className={styles.row} {...(copy ? ({ "aria-hidden": true, inert: "" } as object) : {})}>
      {members.map((m) => (
        <li key={m.name} className={styles.item}>
          <TeamCard {...m} />
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={ref} className={styles.viewport} data-running={visible || undefined}>
      <div className={styles.track} style={{ animationDuration: `${members.length * secondsPerCard}s` }}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
