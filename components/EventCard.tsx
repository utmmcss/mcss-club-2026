import { formatEventDate, formatToLocalDateTime } from "@/lib/utils";
import styles from "./EventCard.module.css";

interface EventCardProps {
  title: string;
  date?: string | null;
  location?: string | null;
  description?: string | null;
  link?: string | null;
  isUpcoming?: boolean;
  startTime?: string | null;
  endTime?: string | null;
  startDateTime?: string | null;
  endDateTime?: string | null;
  onClick?: () => void;
}

const EventCard = ({ title, date, location, startTime, endTime, startDateTime, endDateTime, onClick }: EventCardProps) => {
  let timeText: string | null = null;

  if (startDateTime) {
    const startLocal = formatToLocalDateTime(startDateTime, { date: false, time: true });
    const endLocal = endDateTime ? formatToLocalDateTime(endDateTime, { date: false, time: true }) : null;
    timeText = endLocal ? `${startLocal} - ${endLocal}` : startLocal;
  } else {
    timeText = startTime ? (endTime ? `${startTime.substring(0,5)} - ${endTime.substring(0,5)}` : startTime.substring(0,5)) : null;
  }

  const fullDate = formatEventDate(date);
  const d = fullDate && date ? new Date(date) : null;
  const day = d ? String(d.getUTCDate()).padStart(2, "0") : "—";
  const month = d ? d.toLocaleDateString("en-CA", { month: "short", timeZone: "UTC" }) : "TBA";
  const year = d ? d.getUTCFullYear() : null;

  return (
    <div className={`${styles.item} border-b border-mcss-ink/15`}>
      <button type="button" onClick={onClick} aria-haspopup="dialog" className={`${styles.row} text-mcss-ink`}>
        <span className={styles.inner}>
          <span className={`${styles.date} block`}>
            <span aria-hidden="true" className={`${styles.day} block font-heading text-5xl font-normal leading-none`}>{day}</span>
            <span aria-hidden="true" className="mt-1 block font-sub text-xs font-bold uppercase tracking-[0.2em]">
              {month}{year ? ` ${year}` : ""}
            </span>
            <span className="sr-only">{fullDate ?? "Date to be announced"}</span>
          </span>
          <span className="block font-sub text-xl font-bold leading-tight md:text-2xl">{title}</span>
          <span className="block text-sm text-muted-foreground">
            {location && <span className="block">{location}</span>}
            {timeText && <span className="block">{timeText}</span>}
          </span>
          <span aria-hidden="true" className={`${styles.arrow} font-sans text-2xl`}>→</span>
        </span>
      </button>
    </div>
  );
};

export default EventCard;
