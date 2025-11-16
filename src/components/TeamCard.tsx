import { Linkedin, Github } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TeamCardProps {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  github?: string;
}

const TeamCard = ({ name, role, image, linkedin, github }: TeamCardProps) => {
  return (
    <Card className="card-hover text-center">
      <CardContent className="pt-6">
        <div className="mb-4 mx-auto w-32 h-32 rounded-full overflow-hidden bg-muted">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{role}</p>
        <div className="flex justify-center gap-3">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
