export enum ModelId {
  gpt_4o_realtime = "gpt-4o-realtime",
}

export interface Model {
  id: ModelId;
  name: string;
}

export const models: Model[] = [
  {
    id: ModelId.gpt_4o_realtime,
    name: "gpt-4o-realtime",
  },
];
