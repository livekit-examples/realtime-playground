export enum ModalitiesId {
  text_and_audio = "text_and_audio",
  text_only = "text_only",
}

export interface Modalities {
  id: ModalitiesId;
  name: string;
  description: string;
}

export const modalities: Modalities[] = [
  {
    id: ModalitiesId.text_and_audio,
    name: "Audio + Text",
    description: "The model will produce both audio and text.",
  },
  {
    id: ModalitiesId.text_only,
    name: "Text Only",
    description: "The model will produce text only.",
  },
];
