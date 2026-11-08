import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { formatEventDate, formatToLocalDateTime } from "@/lib/utils";

const label = "font-sub text-xs font-bold uppercase tracking-[0.2em] text-mcss-ink";
const btn = "inline-flex items-center justify-center px-5 py-3 font-sub text-xs font-bold uppercase tracking-[0.2em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mcss-purple";

export default function EventDetailsDialog({ event, onClose }: { event: any | null; onClose: () => void }) {
  if (!event) return null;

  const {
    title,
    date,
    startTime,
    endTime,
    startDateTime,
    endDateTime,
    location,
    description,
    link,
    isUpcoming,
  } = event;

  const dateFormatted = formatEventDate(date);
  const startFormatted = startDateTime ? formatToLocalDateTime(startDateTime, { date: true, time: true }) : (dateFormatted ? `${dateFormatted}${startTime ? ` • ${startTime.substring(0,5)}` : ''}` : null);
  const endFormatted = endDateTime ? formatToLocalDateTime(endDateTime, { date: true, time: true }) : (dateFormatted ? (endTime ? `${dateFormatted} • ${endTime.substring(0,5)}` : null) : null);
  const meta = [startFormatted || dateFormatted || '—', location].filter(Boolean).join("  ·  ");

  return (
    <Dialog open={Boolean(event)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto rounded-none border-mcss-ink/15 bg-mcss-paper p-0 text-mcss-ink shadow-none sm:rounded-none">
        <div aria-hidden="true" className="h-[3px] w-full bg-[linear-gradient(90deg,var(--mcss-purple),var(--mcss-periwinkle),var(--mcss-sky),var(--mcss-blue),var(--mcss-purple))]" />
        <div className="space-y-6 p-6 sm:p-8">
          <DialogHeader className="space-y-3 pr-6">
            <DialogDescription className="font-sub text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {meta}
            </DialogDescription>
            <DialogTitle className="font-sub text-2xl font-bold leading-tight md:text-3xl">{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 border-t border-mcss-ink/15 pt-5">
            {description && (
              <div>
                <h4 className={label}>Description</h4>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className={label}>Start</h4>
                <p className="mt-2 text-sm text-muted-foreground">{startFormatted || '—'}</p>
              </div>
              <div>
                <h4 className={label}>End</h4>
                <p className="mt-2 text-sm text-muted-foreground">{endFormatted || '—'}</p>
              </div>
            </div>

            <div>
              <h4 className={label}>Status</h4>
              <p className="mt-2 text-sm text-muted-foreground">{isUpcoming ? 'Upcoming' : 'Past'}</p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:space-x-0">
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer" className={`${btn} bg-mcss-ink text-mcss-paper transition-opacity hover:opacity-85`}>
                See More Details <span aria-hidden="true" className="ml-2">→</span>
              </a>
            )}
            <DialogClose asChild>
              <button type="button" className={`${btn} border border-mcss-ink transition-colors hover:bg-mcss-ink hover:text-mcss-paper`}>Close</button>
            </DialogClose>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
