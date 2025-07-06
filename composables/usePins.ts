export enum PinType {
  URL = "url",
  TEXT = "text",
  AUDIO = "audio",
  IMAGE = "image"
}

export enum PinVisibility {
  PRIVATE = 1,
  PUBLIC = 2
}

export interface Pin {
  uid: string;
  type: PinType;
  content?: string;
  url?: string;
  tags: string[];
  metadata: Record<string, unknown>;
  visibility?: PinVisibility;
}

export interface CreatePinData {
  url: string;
  content: string;
  visibility: PinVisibility;
}
