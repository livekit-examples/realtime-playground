"use client";

import { useEffect, useState } from "react";
import { usePlaygroundState } from "@/hooks/use-playground-state";
import { useConnectionState } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";

export interface InstructionsEditorProps {
  instructions?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onDirty?: () => void;
}

export function InstructionsEditor({
  instructions,
  onFocus,
  onBlur,
  onDirty,
}: InstructionsEditorProps) {
  const connectionState = useConnectionState();
  const { pgState, dispatch } = usePlaygroundState();
  const [dirty, setDirty] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState(instructions || "");

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    if (
      connectionState === ConnectionState.Connected &&
      newValue !== pgState.instructions
    ) {
      setDirty(true);
      if (onDirty) {
        onDirty();
      }
    }
  };

  const handleBlur = () => {
    dispatch({ type: "SET_INSTRUCTIONS", payload: inputValue });
    setDirty(false);
    if (onBlur) {
      onBlur();
    }
  };

  useEffect(() => {
    if (instructions !== undefined && instructions !== inputValue) {
      setInputValue(instructions);
      setDirty(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instructions]);

  return (
    <textarea
      value={inputValue}
      onChange={handleInputChange}
      onFocus={onFocus}
      onBlur={handleBlur}
      placeholder="Enter system instructions"
      className="w-full h-full rounded outline-none font-mono text-sm"
    />
  );
}
