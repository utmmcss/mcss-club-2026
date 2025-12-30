import EventCard from "@/components/EventCard";

const EventGrid = ({
  events,
  onSelect,
  onSubscribe,
}: {
  events: any[];
  onSelect: (id: string) => void;
  onSubscribe?: (title: string, date: string) => void;
}) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event, index) => (
        <EventCard
          key={event.id || index}
          {...event}
          onClick={() => event?.id && onSelect(event.id)}
          onSubscribe={onSubscribe}
        />
      ))}
    </div>
  );
};

export default EventGrid;
