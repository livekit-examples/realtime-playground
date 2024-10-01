import { AgentState } from "@/data/agent";
import { useEffect, useRef, useState } from "react";
import {
  GridAnimationOptions,
  GridAnimatorState,
} from "@/components/agent/agent-control-bar";
import { generateConnectingSequenceBar } from "@/components/agent/animation-sequences/connecting-sequence";
import { generateListeningSequenceBar } from "@/components/agent/animation-sequences/listening-sequence";
import { generateThinkingSequenceBar } from "@/components/agent/animation-sequences/thinking-sequence";

export const useBarAnimator = (
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
      setSequence(generateThinkingSequenceBar(columns));
    } else if (type === "connecting") {
      const sequence = [...generateConnectingSequenceBar(columns)];
      setSequence(sequence);
    } else if (type === "listening") {
      setSequence(generateListeningSequenceBar(columns));
    } else {
      setSequence([]);
    }
    setIndex(0);
  }, [type, columns, state, animationOptions?.connectingRing]);

  const animationFrameId = useRef<number | null>(null);
  useEffect(() => {
    if (state === "paused") {
      return;
    }

    let startTime = performance.now();

    const animate = (time: DOMHighResTimeStamp) => {
      const timeElapsed = time - startTime;

      if (timeElapsed >= interval) {
        setIndex((prev) => prev + 1);
        startTime = time;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [interval, columns, state, type, sequence.length]);

  return sequence[index % sequence.length];
};
