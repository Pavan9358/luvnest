import { useRef } from "react";
import { nanoid } from "nanoid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, GripVertical, ImagePlus, Loader2, Music } from "lucide-react";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import type { TimelineSection, TimelineEvent } from "@/types/lovepage";
import { AIAssistButton } from "@/components/builder/AIAssistButton";

interface TimelineEditorProps {
  section: TimelineSection;
  onUpdate: (updates: Partial<TimelineSection["data"]>) => void;
}

export function TimelineEditor({ section, onUpdate }: TimelineEditorProps) {
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const { uploadFile, uploading } = useMediaUpload();

  const addEvent = () => {
    const newEvent: TimelineEvent = {
      id: nanoid(),
      date: "",
      title: "",
      description: "",
      imageUrl: undefined,
    };
    onUpdate({ events: [...section.data.events, newEvent] });
  };

  const updateEvent = (eventId: string, updates: Partial<TimelineEvent>) => {
    const updatedEvents = section.data.events.map((event) =>
      event.id === eventId ? { ...event, ...updates } : event
    );
    onUpdate({ events: updatedEvents });
  };

  const removeEvent = (eventId: string) => {
    onUpdate({ events: section.data.events.filter((e) => e.id !== eventId) });
  };

  const handleFileUpload = async (eventId: string, file: File) => {
    const result = await uploadFile(file);
    if (result) {
      updateEvent(eventId, { imageUrl: result.url });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${section.id}-title`}>Timeline Title</Label>
        <Input
          id={`${section.id}-title`}
          value={section.data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Our Journey Together"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Milestone Events</Label>
          <div className="flex gap-2">
            <AIAssistButton 
              sectionType="timeline"
              currentContent={section.data.title}
              onApplySuggestion={(suggestion) => {
                // AI suggestions can update the timeline title or add as new event description
                if (section.data.events.length > 0) {
                  // If events exist, update the last event's description
                  const lastEvent = section.data.events[section.data.events.length - 1];
                  if (!lastEvent.description || lastEvent.description.length < 10) {
                    updateEvent(lastEvent.id, { description: suggestion });
                  } else {
                    // Create a new event with the suggestion
                    const newEvent = {
                      id: nanoid(),
                      date: "",
                      title: "New Memory",
                      description: suggestion,
                      imageUrl: undefined,
                    };
                    onUpdate({ events: [...section.data.events, newEvent] });
                  }
                } else {
                  // If no events, update the title with the suggestion
                  onUpdate({ title: suggestion });
                }
              }}
            />
            <Button variant="outline" size="sm" onClick={addEvent}>
              <Plus className="h-4 w-4 mr-1" />
              Add Event
            </Button>
          </div>
        </div>

        {section.data.events.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="text-sm">No events yet. Add your first milestone!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {section.data.events.map((event) => (
              <Card key={event.id} className="p-3">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center pt-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                    <div className="flex-1 w-px bg-border my-2" />
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <Input
                        value={event.date}
                        onChange={(e) => updateEvent(event.id, { date: e.target.value })}
                        placeholder="Date (e.g., Feb 14, 2020)"
                        className="w-40"
                      />
                      <Input
                        value={event.title}
                        onChange={(e) => updateEvent(event.id, { title: e.target.value })}
                        placeholder="Event title"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Textarea
                      value={event.description}
                      onChange={(e) => updateEvent(event.id, { description: e.target.value })}
                      placeholder="Describe this special moment..."
                      className="min-h-[60px]"
                    />

                    <input
                      ref={(el) => { inputRefs.current[event.id] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(event.id, file);
                      }}
                    />

                    {event.imageUrl ? (
                      <div className="relative w-32 h-24 rounded overflow-hidden">
                        <img
                          src={event.imageUrl}
                          alt="Event"
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => updateEvent(event.id, { imageUrl: undefined })}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8"
                        onClick={() => inputRefs.current[event.id]?.click()}
                        disabled={uploading}
                      >
                        {uploading ? (
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        ) : (
                          <ImagePlus className="h-3 w-3 mr-1" />
                        )}
                        Add Photo
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Background Audio URL */}
      <div className="space-y-2 pt-4 border-t">
        <Label className="flex items-center gap-2">
          <Music className="h-4 w-4 text-primary" />
          Background Music (Optional)
        </Label>
        <Input
          value={section.data.backgroundAudioUrl || ""}
          onChange={(e) => onUpdate({ backgroundAudioUrl: e.target.value })}
          placeholder="Paste Spotify, YouTube, or audio link..."
          className="text-sm"
        />
        <p className="text-xs text-muted-foreground">
          Add music that plays while viewing your timeline 🎵
        </p>
      </div>
    </div>
  );
}
