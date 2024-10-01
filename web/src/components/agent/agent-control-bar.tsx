import { AgentState } from "@/data/agent";
import { ComponentType, CSSProperties } from "react";
import { AgentBarVisualizer } from "./visualizers/bar-visualizer";
import { AgentGridVisualizer } from "./visualizers/grid-visualizer";
import { AgentRadialBarVisualizer } from "@/components/agent/visualizers/radial-visualizer";

export type GridAnimationOptions = {
  interval?: number;
  connectingRing?: number;
  onTransition?: string;
  offTransition?: string;
};

export type AgentVisualizerOptions = {
  baseStyle: CSSProperties;
  gridComponent?: ComponentType<{ style: CSSProperties }>;
  gridSpacing?: string;
  onStyle?: CSSProperties;
  offStyle?: CSSProperties;
  transformer?: (distanceFromCenter: number) => CSSProperties;
  rowCount?: number;
  animationOptions?: GridAnimationOptions;
  maxHeight?: number;
  minHeight?: number;
  radiusFactor?: number;
  radial?: boolean;
  stateOptions?: {
    [key in AgentState]: AgentVisualizerOptions;
  };
};

export type AgentVisualizerProps = {
  style?: "grid" | "bar" | "radial" | "waveform";
  state: AgentState;
  volumeBands: number[];
  options?: AgentVisualizerOptions;
};

export type GridAnimatorState = "paused" | "active";

// Separate style and semantic properties
// Semantic, react component
// style: CSS
// Animator is a hooks
// Animation properties in css vars
export const AgentVisualizer = ({
  style = "grid",
  state,
  volumeBands,
  options,
}: AgentVisualizerProps) => {
  if (style === "grid") {
    return (
      <AgentGridVisualizer
        state={state}
        volumeBands={volumeBands}
        options={options}
      />
    );
  } else if (style === "bar") {
    return (
      <AgentBarVisualizer
        state={state}
        volumeBands={volumeBands}
        options={options}
      />
    );
  } else if (style === "radial") {
    return (
      <AgentRadialBarVisualizer
        state={state}
        volumeBands={volumeBands}
        options={options}
      />
    );
  }
  return (
    <AgentWaveformVisualizer
      state={state}
      volumeBands={volumeBands}
      options={options}
    />
  );
};

export const AgentWaveformVisualizer = ({
  state,
  volumeBands,
  options,
}: AgentVisualizerProps) => {
  return <div></div>;
};
