export enum VoiceId {
  alloy = "alloy",
  shimmer = "shimmer",
  echo = "echo",
  ash = "ash",
  ballad = "ballad",
  coral = "coral",
  sage = "sage",
  verse = "verse",
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
  {
    id: VoiceId.ash,
    name: "Ash",
  },
  {
    id: VoiceId.ballad,
    name: "Ballad",
  },
  {
    id: VoiceId.coral,
    name: "Coral",
  },
  {
    id: VoiceId.sage,
    name: "Sage",
  },
  {
    id: VoiceId.verse,
    name: "Verse",
  },
];
