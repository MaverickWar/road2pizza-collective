import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroProps {
  title?: string;
  description: string;
  image: string;
  showButtons?: boolean;
  badgeText?: string;
}

function Hero({ 
  title = "This is the start of something!",
  description,
  image,
  showButtons = false,
  badgeText
}: HeroProps) {
  return (
    <div className="w-full py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-6 items-center lg:grid-cols-2">
          <div className="flex gap-4 flex-col">
            {badgeText && (
              <div>
                <Badge variant="outline">{badgeText}</Badge>
              </div>
            )}
            <div className="flex gap-4 flex-col">
              <h2 className="text-4xl md:text-5xl max-w-lg tracking-tighter text-left font-regular">
                {title}
              </h2>
              <p className="text-lg leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                {description}
              </p>
            </div>
            {showButtons && (
              <div className="flex flex-row gap-4">
                <Button size="lg" className="gap-4" variant="outline">
                  Jump on a call <PhoneCall className="w-4 h-4" />
                </Button>
                <Button size="lg" className="gap-4">
                  Sign up here <MoveRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          <div className="rounded-lg overflow-hidden aspect-video">
            <img 
              src={image} 
              alt="Hero image"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/placeholder.svg';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };