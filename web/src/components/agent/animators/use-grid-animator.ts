import { AgentState } from "@/data/agent";
import { useEffect, useState } from "react";
import {
  GridAnimationOptions,
  GridAnimatorState,
} from "@/components/agent/agent-control-bar";
import { generateConnectingSequence } from "@/components/agent/animation-sequences/connecting-sequence";
import { generateListeningSequence } from "@/components/agent/animation-sequences/listening-sequence";
import { generateThinkingSequence } from "@/components/agent/animation-sequences/thinking-sequence";

export const useGridAnimator = (
  type: AgentState,
  rows: number,
  columns: number,
  interval: number,
  state: GridAnimatorState,
  animationOptions?: GridAnimationOptions,
): { x: number; y: number } => {
  const [index, setIndex] = useState(0);
  const [sequence, setSequence] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (type === "thinking") {
      setSequence(generateThinkingSequence(rows, columns));
    } else if (type === "connecting") {
      const sequence = [
        ...generateConnectingSequence(
          rows,
          columns,
          animationOptions?.connectingRing ?? 1,
        ),
      ];
      setSequence(sequence);
    } else if (type === "listening") {
      setSequence(generateListeningSequence(rows, columns));
    } else {
      setSequence([]);
    }
    setIndex(0);
  }, [type, rows, columns, state, animationOptions?.connectingRing]);

  useEffect(() => {
    if (state === "paused") {
      return;
    }
    const indexInterval = setInterval(() => {
      setIndex((prev) => {
        return prev + 1;
      });
    }, interval);
    return () => clearInterval(indexInterval);
  }, [interval, columns, rows, state, type, sequence.length]);

  return sequence[index % sequence.length];
};
