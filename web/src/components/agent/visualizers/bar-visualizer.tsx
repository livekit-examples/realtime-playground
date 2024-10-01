import { useMemo } from "react";
import { AgentVisualizerProps } from "@/components/agent/agent-control-bar";
import { useBarAnimator } from "@/components/agent/animators/use-bar-animator";

export const AgentBarVisualizer = ({
  state,
  volumeBands,
  options,
}: AgentVisualizerProps) => {
  const gridColumns = volumeBands.length;
  const gridArray = Array.from({ length: gridColumns }).map((_, i) => i);
  const minHeight = options?.minHeight ?? 8;
  const maxHeight = options?.maxHeight ?? 64;
  const midpoint = Math.floor(gridColumns / 2.0);

  let animationOptions = options?.animationOptions;

  if (options?.stateOptions) {
    animationOptions = {
      ...animationOptions,
      ...options.stateOptions[state]?.animationOptions,
    };
  }
  const highlightedIndex = useBarAnimator(
    state,
    gridColumns,
    animationOptions?.interval ?? 100,
    state !== "speaking" ? "active" : "paused",
    animationOptions,
  );

  // TODO: Remove useMemo
  const bars = useMemo(() => {
    let baseStyle = options?.baseStyle ?? {};
    let onStyle = {
      ...baseStyle,
      ...(options?.onStyle ?? {}),
      ...(options?.stateOptions ? options.stateOptions[state]?.onStyle : {}),
    };
    let offStyle = {
      ...baseStyle,
      ...(options?.offStyle ?? {}),
      ...(options?.stateOptions ? options.stateOptions[state]?.offStyle : {}),
    };
    return gridArray.map((x) => {
      const height = volumeBands[x] * (maxHeight - minHeight) + minHeight;
      //console.log("height", height, volumeBands[x], minHeight, maxHeight);
      const distanceFromCenter = Math.abs(midpoint - x);
      const isIndexHighlighted =
        typeof highlightedIndex === "object"
          ? highlightedIndex.includes(x)
          : highlightedIndex === x;
      return (
        <div
          key={x}
          style={{
            height: `${height}px`,
            ...(isIndexHighlighted || state === "speaking"
              ? onStyle
              : offStyle),
            transition: isIndexHighlighted
              ? animationOptions?.onTransition
              : animationOptions?.offTransition,
            ...options?.transformer?.(distanceFromCenter),
          }}
        ></div>
      );
    });
  }, [
    options,
    gridArray,
    volumeBands,
    maxHeight,
    minHeight,
    midpoint,
    highlightedIndex,
    state,
    animationOptions,
  ]);

  return (
    <div>
      <div
        className={`flex items-center justify-center`}
        style={{
          height: `${maxHeight}px`,
          gap: options?.gridSpacing ?? "4px",
        }}
      >
        {bars}
      </div>
    </div>
  );
};
