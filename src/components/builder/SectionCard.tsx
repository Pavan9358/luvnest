import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Trash2,
  Heart,
  Mail,
  Clock,
  Image,
  Timer,
  Gift,
  Sparkles,
  BookHeart,
  HeartHandshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LovePageSection, SectionType } from "@/types/lovepage";
import { SECTION_LABELS } from "@/types/lovepage";

const SECTION_ICON_COMPONENTS: Record<SectionType, React.ElementType> = {
  "hero": Heart,
  "love-letter": Mail,
  "timeline": Clock,
  "gallery": Image,
  "countdown": Timer,
  "surprise": Gift,
  "ai-story": Sparkles,
  "magazine": BookHeart,
  "be-my-valentine": HeartHandshake,
};

interface SectionCardProps {
  section: LovePageSection;
  onToggleVisibility: () => void;
  onRemove: () => void;
  children: React.ReactNode;
}

export function SectionCard({
  section,
  onToggleVisibility,
  onRemove,
  children,
}: SectionCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const IconComponent = SECTION_ICON_COMPONENTS[section.type];

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "card-romantic transition-all",
        isDragging && "opacity-50 shadow-romantic-hover scale-[1.02]",
        !section.visible && "opacity-60"
      )}
    >
      <CardHeader className="flex flex-row items-center gap-3 py-3 px-4 border-b">
        <button
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 flex-1">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <IconComponent className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium text-sm">
            {SECTION_LABELS[section.type]}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onToggleVisibility}
          >
            {section.visible ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {children}
      </CardContent>
    </Card>
  );
}
