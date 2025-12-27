import { Calendar, MapPin, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  description: string;
  isUpcoming?: boolean;
  onSubscribe?: (title: string, date: string) => void;
}

const EventCard = ({ title, date, location, description, isUpcoming, onSubscribe }: EventCardProps) => {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "";

  return (
    <Card className="card-hover">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="flex flex-col gap-2 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formattedDate || date}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{location}</span>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-muted-foreground">{description}</p>
        {isUpcoming && onSubscribe && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onSubscribe(title, date);
            }}
          >
            <Bell className="mr-2 h-4 w-4" />
            Get Reminder
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
