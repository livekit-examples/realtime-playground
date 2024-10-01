export type AgentState =
  | "offline"
  | "connecting"
  | "listening"
  | "thinking"
  | "speaking";
export const AgentStates: AgentState[] = [
  "offline",
  "connecting",
  "listening",
  "thinking",
  "speaking",
];
