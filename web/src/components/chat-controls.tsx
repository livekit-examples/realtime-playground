import { Button } from "@/components/ui/button";
import { Edit, Settings, MessageSquareQuote, AudioLines } from "lucide-react";
import { ConfigurationFormDrawer } from "@/components/configuration-form-drawer";
import { TranscriptDrawer } from "@/components/transcript-drawer";

interface ChatControlsProps {
  showEditButton: boolean;
  isEditingInstructions: boolean;
  onToggleEdit: () => void;
}

export function ChatControls({
  showEditButton,
  isEditingInstructions,
  onToggleEdit,
}: ChatControlsProps) {
  return (
    <div className="absolute top-2 left-2 right-2 flex justify-between">
      <div className="flex gap-2">
        <ConfigurationFormDrawer>
          <Button variant="outline" size="icon" className="lg:hidden">
            <Settings className="h-4 w-4" />
          </Button>
        </ConfigurationFormDrawer>
      </div>
      <div className="flex gap-2">
        {showEditButton && (
          <Button variant="outline" size="icon" onClick={onToggleEdit}>
            {isEditingInstructions ? (
              <AudioLines className="h-4 w-4" />
            ) : (
              <Edit className="h-4 w-4" />
            )}
          </Button>
        )}
        <TranscriptDrawer>
          <Button variant="outline" size="icon" className="md:hidden">
            <MessageSquareQuote className="h-4 w-4" />
          </Button>
        </TranscriptDrawer>
      </div>
    </div>
  );
}
