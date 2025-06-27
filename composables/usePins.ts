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


export const usePins = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase as string

  const usersPinsIndex = (page: number = 1, search: string = '') => {
    return useFetch('users/281nba/pins/', {
      baseURL: apiBase,
      query: {
        page,
        search,
      }
    })
  }

  const pinsIndex = (page: number = 1, search: string = '') => {
    return useFetch('pins/', {
      baseURL: apiBase,
      query: {
        page,
        search,
      }
    })
  }

  const pinsStore = (pinData) => {
    return useFetch('pins/', {
      baseURL: apiBase,
      method: 'POST',
      body: pinData,
    })
  }

  const pinsUpdate = (uid, pinData) => {
    return useFetch(`pins/${uid}`, {
      baseURL: apiBase,
      method: 'PUT',
      body: pinData,
    })
  }

  const pinsDestroy = (uid) => {
    return useFetch(`pins/${uid}`, {
      baseURL: apiBase,
      method: 'DELETE',
    })
  }

  return {
    usersPinsIndex,
    pinsIndex,
    pinsStore,
    pinsUpdate,
    pinsDestroy,
  }
}
