export enum TurnDetectionTypeId {
  server_vad = "server_vad",
  none = "none",
}

export interface TurnDetectionType {
  id: TurnDetectionTypeId;
  name: string;
  description: string;
}

export const turnDetectionTypes: TurnDetectionType[] = [
  {
    id: TurnDetectionTypeId.server_vad,
    name: "Server VAD",
    description:
      "The model will automatically detect when the user has finished speaking and end the turn.",
  },
  {
    id: TurnDetectionTypeId.none,
    name: "None",
    description:
      "The client must perform its own turn logic and inform the model.",
  },
];
