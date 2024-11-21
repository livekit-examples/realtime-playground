"use client";

import { useState } from "react";
import { InstructionsEditor } from "@/components/instructions-editor";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CircleHelp } from "lucide-react";

export function Instructions() {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { pgState } = usePlaygroundState();

  return (
    <div
      className={`flex flex-1 flex-col w-full gap-[4px] border p-4 rounded-lg ${
        isFocused ? "ring-1" : "ring-0"
      } h-[70vh] overflow-y-auto`}
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="text-xs font-semibold uppercase mr-1 tracking-widest">
            INSTRUCTIONS
          </div>
          <HoverCard open={isOpen}>
            <HoverCardTrigger asChild>
              <CircleHelp
                className="h-4 w-4 text-gray-500 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
              />
            </HoverCardTrigger>
            <HoverCardContent
              className="w-[260px] text-sm"
              side="bottom"
              onInteractOutside={() => setIsOpen(false)}
            >
              Instructions are a system message that is prepended to the
              conversation whenever the model responds. Updates will be
              reflected on the next conversation turn.
            </HoverCardContent>
          </HoverCard>
        </div>
      </div>
      <InstructionsEditor
        instructions={pgState.instructions}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  );
}
