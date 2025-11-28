import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { formatToLocalDateTime } from "@/lib/utils";

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

  const startFormatted = startDateTime ? formatToLocalDateTime(startDateTime, { date: true, time: true }) : (date ? `${date}${startTime ? ` • ${startTime.substring(0,5)}` : ''}` : null);
  const endFormatted = endDateTime ? formatToLocalDateTime(endDateTime, { date: true, time: true }) : (date ? (endTime ? `${date} • ${endTime.substring(0,5)}` : null) : null);

  return (
    <Dialog open={Boolean(event)} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{startFormatted ? startFormatted : (date || '—')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {location && (
            <div>
              <h4 className="font-semibold">Location</h4>
              <p className="text-sm text-muted-foreground">{location}</p>
            </div>
          )}

          {description && (
            <div>
              <h4 className="font-semibold">Description</h4>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">Start</h4>
              <p className="text-sm text-muted-foreground">{startFormatted || '—'}</p>
            </div>
            <div>
              <h4 className="font-semibold">End</h4>
              <p className="text-sm text-muted-foreground">{endFormatted || '—'}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Status</h4>
            <p className="text-sm text-muted-foreground">{isUpcoming ? 'Upcoming' : 'Past'}</p>
          </div>
        </div>

        <DialogFooter>
          {link && (
            <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm text-white">
              See More Details
            </a>
          )}
          <DialogClose asChild>
            <button className="inline-flex items-center rounded-md border px-4 py-2 text-sm">Close</button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}