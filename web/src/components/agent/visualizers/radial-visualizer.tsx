import { useMemo } from "react";
import { AgentVisualizerProps } from "@/components/agent/agent-control-bar";
import { useRadialBarAnimator } from "@/components/agent/animators/use-radial-animator";

export const AgentRadialBarVisualizer = ({
  state,
  volumeBands,
  options,
}: AgentVisualizerProps) => {
  const gridColumns = volumeBands.length;
  const gridArray = Array.from({ length: gridColumns }).map((_, i) => i);

  const minHeight = options?.minHeight ?? 64;
  const maxHeight = options?.maxHeight ?? 8;
  const midpoint = Math.floor(gridColumns / 2.0);

  let deg = 360 / gridColumns;

  let animationOptions = options?.animationOptions;
  if (options?.stateOptions) {
    animationOptions = {
      ...animationOptions,
      ...options.stateOptions[state]?.animationOptions,
    };
  }
  const highlightedIndex = useRadialBarAnimator(
    state,
    gridColumns,
    animationOptions?.interval ?? 100,
    state !== "speaking" ? "active" : "paused",
    animationOptions,
  );

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
      const isIndexHighlighted =
        typeof highlightedIndex === "object"
          ? highlightedIndex.includes(x)
          : highlightedIndex === x;
      const height = volumeBands[x] * (maxHeight - minHeight) + minHeight;
      const distanceFromCenter = Math.abs(midpoint - x);
      return (
        <div
          key={x}
          className="flex flex-col"
          style={{
            height: `${maxHeight * (options?.radiusFactor ?? 2)}px`,
            transform: `rotateZ(${deg * x}deg)`,
            transformOrigin: "50% 100%",
            position: "absolute",
          }}
        >
          <div
            className="flex flex-col items-center justify-end"
            style={{ height: `${maxHeight}px` }}
          >
            <div
              style={{
                height: `${height}px`,
                ...options?.transformer?.(distanceFromCenter),
                ...(isIndexHighlighted || state === "speaking"
                  ? onStyle
                  : offStyle),
                transition: isIndexHighlighted
                  ? animationOptions?.onTransition
                  : animationOptions?.offTransition,
              }}
            ></div>
          </div>
        </div>
      );
    });
  }, [
    options,
    state,
    gridArray,
    highlightedIndex,
    volumeBands,
    maxHeight,
    minHeight,
    midpoint,
    deg,
    animationOptions?.onTransition,
    animationOptions?.offTransition,
  ]);

  return (
    <div
      className={`relative flex h-full justify-center bg-red-500`}
      style={{
        transform: `translateY(25%)`,
      }}
    >
      {bars}
    </div>
  );
};
