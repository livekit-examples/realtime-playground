import { AgentState } from "@/data/agent";
import { useEffect, useState } from "react";
import {
  GridAnimationOptions,
  GridAnimatorState,
} from "@/components/agent/agent-control-bar";
import { generateConnectingSequenceRadialBar } from "@/components/agent/animation-sequences/connecting-sequence";
import { generateListeningSequenceRadialBar } from "@/components/agent/animation-sequences/listening-sequence";
import { generateThinkingSequenceRadialBar } from "@/components/agent/animation-sequences/thinking-sequence";

export const useRadialBarAnimator = (
  type: AgentState,
  columns: number,
  interval: number,
  state: GridAnimatorState,
  animationOptions?: GridAnimationOptions,
): number | number[] => {
  const [index, setIndex] = useState(0);
  const [sequence, setSequence] = useState<(number | number[])[]>([]);

  useEffect(() => {
    if (type === "thinking") {
      setSequence(generateThinkingSequenceRadialBar(columns));
    } else if (type === "connecting") {
      const sequence = [...generateConnectingSequenceRadialBar(columns)];
      setSequence(sequence);
    } else if (type === "listening") {
      setSequence(generateListeningSequenceRadialBar(columns));
    } else {
      setSequence([]);
    }
    setIndex(0);
  }, [type, columns, state, animationOptions?.connectingRing]);

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
  }, [interval, columns, state, type, sequence.length]);

  return sequence[index % sequence.length];
};
