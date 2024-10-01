export enum VoiceId {
  alloy = "alloy",
  shimmer = "shimmer",
  echo = "echo",
}

export interface Voice {
  id: VoiceId;
  name: string;
}

export const voices: Voice[] = [
  {
    id: VoiceId.alloy,
    name: "Alloy",
  },
  {
    id: VoiceId.shimmer,
    name: "Shimmer",
  },
  {
    id: VoiceId.echo,
    name: "Echo",
  },
];
