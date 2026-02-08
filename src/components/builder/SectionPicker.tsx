import {
  Heart,
  Mail,
  Clock,
  Image,
  Timer,
  Gift,
  Sparkles,
  Plus,
  BookHeart,
  HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import type { SectionType } from "@/types/lovepage";
import { SECTION_LABELS } from "@/types/lovepage";

const SECTION_OPTIONS: { type: SectionType; icon: React.ElementType; premium?: boolean }[] = [
  { type: "hero", icon: Heart },
  { type: "love-letter", icon: Mail },
  { type: "timeline", icon: Clock },
  { type: "gallery", icon: Image },
  { type: "countdown", icon: Timer, premium: true },
  { type: "surprise", icon: Gift },
  { type: "ai-story", icon: Sparkles, premium: true },
  { type: "magazine", icon: BookHeart },
  { type: "be-my-valentine", icon: HeartHandshake },
];
// Note: Background Music and Voice Message removed - audio integrated into Timeline, Gallery, Love Letter sections

interface SectionPickerProps {
  onAddSection: (type: SectionType) => void;
  existingSections: SectionType[];
}

export function SectionPicker({ onAddSection, existingSections }: SectionPickerProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="btn-romantic text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuLabel>Choose a Section</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {SECTION_OPTIONS.map((option) => {
          const IconComponent = option.icon;
          const alreadyAdded = option.type === "hero" && existingSections.includes("hero");
          
          return (
            <DropdownMenuItem
              key={option.type}
              onClick={() => !alreadyAdded && onAddSection(option.type)}
              disabled={alreadyAdded}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <IconComponent className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <span className="font-medium">{SECTION_LABELS[option.type]}</span>
              </div>
              {option.premium && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-gradient-romantic text-white">
                  PRO
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
