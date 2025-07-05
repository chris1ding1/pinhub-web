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

export const usePins = () => {
  const pinsUpdate = (id: string, pinData) => {
    return useAPI(`/pins/${id}`, {
      method: 'PUT',
      body: pinData,
    })
  }

  const pinsDestroy = (id: string) => {
    return useAPI(`/pins/${id}`, {
      method: 'DELETE',
    })
  }

  return {
    pinsUpdate,
    pinsDestroy,
  }
}
