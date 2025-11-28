import { Calendar, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatToLocalDateTime } from "@/lib/utils";

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

const EventCard = ({ title, date, location, description, startTime, endTime, startDateTime, endDateTime, onClick }: EventCardProps) => {
  let timeText: string | null = null;

  if (startDateTime) {
    const startLocal = formatToLocalDateTime(startDateTime, { date: false, time: true });
    const endLocal = endDateTime ? formatToLocalDateTime(endDateTime, { date: false, time: true }) : null;
    timeText = endLocal ? `${startLocal} - ${endLocal}` : startLocal;
  } else {
    timeText = startTime ? (endTime ? `${startTime.substring(0,5)} - ${endTime.substring(0,5)}` : startTime.substring(0,5)) : null;
  }

  return (
    <Card className="card-hover cursor-pointer" onClick={onClick}>
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="flex flex-col gap-2 pt-2">
          {date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{date}</span>
            </div>
          )}
          {timeText && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-primary" />
              <span>{timeText}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary" />
              <span>{location}</span>
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default EventCard;
