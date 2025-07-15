import * as v from 'valibot';

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

export interface PinForm {
    url: string;
    content: string;
    audio_path: string;
    image_path: string;
    visibility: PinVisibility;
}

export const PinVisibilityPublic = {
    id: "visibility-public",
    title: 'Public',
    val: PinVisibility.PUBLIC
}

export const PinVisibilityPrivate = {
    id: "visibility-private",
    title: 'Private',
    val: PinVisibility.PRIVATE
}

export const PinImageMaxSize = 5242880 // 5 MB

export const pinUploadImage = async (file: File): Promise<FileUploadResponse | false> => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const response = await useNuxtApp().$api<FileUploadResponse>('/pins/upload-image', {
            method: 'POST',
            body: formData,
        })
        return response
    } catch (error) {
        console.log(error)
        return false
    }
}

export const ValidatorPinImageSchema = v.pipe(
    v.file(),
    v.mimeType(['image/jpeg', 'image/png'], 'Please select a JPEG or PNG file.'),
    v.maxSize(PinImageMaxSize, 'Please select a file smaller than 5 MB.')
)

type ValidationPinErrorDetails = {
    [K in keyof PinForm]: string[];
};

export interface ValidationPinErrors {
    message: string;
    details: ValidationPinErrorDetails;
}

export const ValidatorPinFormSchema = v.pipe(
    v.object({
      url: v.optional(
        v.pipe(
          v.string(),
          v.nonEmpty(),
          v.url(),
          v.maxLength(2048)
        ),
      ),
      content: v.optional(
        v.pipe(
          v.string(),
          v.nonEmpty(),
          v.maxLength(3000),
        ),
      ),
      audio_path: v.optional(
        v.pipe(
          v.string(),
          v.nonEmpty(),
        ),
      ),
      image_path: v.optional(
        v.pipe(
          v.string(),
          v.nonEmpty(),
        ),
      ),
      visibility: v.pipe(
        v.picklist([PinVisibility.PRIVATE, PinVisibility.PUBLIC]),
      ),
    }),
    v.check(
      (input) => Boolean(input.url || input.content || input.audio_path || input.image_path),
      'Please enter either a URL, Content, or upload an image or audio.'
    )
  );
