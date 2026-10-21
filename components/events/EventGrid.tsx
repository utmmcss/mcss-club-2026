import EventCard from "@/components/EventCard";

const EventGrid = ({
  events,
  onSelect,
}: {
  events: any[];
  onSelect: (id: string) => void;
}) => {
  if (events.length === 0) {
    return (
      <p className="border-y border-mcss-ink/15 py-16 text-center font-sub text-sm uppercase tracking-[0.2em] text-muted-foreground">
        No events found
      </p>
    );
  }

  return (
    <div className="border-t border-mcss-ink/15">
      {events.map((event, index) => (
        <EventCard
          key={event.id || index}
          {...event}
          onClick={() => event?.id && onSelect(event.id)}
        />
      ))}
    </div>
  );
};

export default EventGrid;
