export enum TranscriptionModelId {
  whisper1 = "whisper-1",
}

export interface TranscriptionModel {
  id: TranscriptionModelId;
  name: string;
}

export const transcriptionModels: TranscriptionModel[] = [
  {
    id: TranscriptionModelId.whisper1,
    name: "whisper-1",
  },
];
