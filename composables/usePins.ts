import * as v from 'valibot';

export enum PinVisibility {
  PRIVATE = 1,
  PUBLIC = 2
}

export interface PinResponse {
    id: string;
    content: string | null;
    url: string | null;
    audio_path: string | null;
    image_path: string | null;
    audio_url: string | null;
    image_url: string | null;
    url_host: string | null;
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

export type ValidationPinErrorDetails = {
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
          v.maxLength(2048, 'URL must be less than 2048 characters'),
          v.union([
            v.literal(''),
            v.pipe(v.string(), v.url('Please enter a valid URL'))
          ])
        ),
      ),
      content: v.optional(
        v.pipe(
          v.string(),
          v.maxLength(3000, 'Content must be less than 3000 characters'),
        ),
      ),
      audio_path: v.optional(
        v.pipe(
          v.string(),
        ),
      ),
      image_path: v.optional(
        v.pipe(
          v.string(),
        ),
      ),
      visibility: v.pipe(
        v.picklist([PinVisibility.PRIVATE, PinVisibility.PUBLIC], 'Please select a valid visibility option'),
      ),
    }),
    v.check(
      (input) => Boolean(input.url || input.content || input.audio_path || input.image_path),
      'Please enter either a URL, Content, or upload an image or Record.'
    )
  );

export const createPin = async (pinForm: PinForm): Promise<ApiResponse<PinResponse> | false> => {
    try {
        const response = await useNuxtApp().$api<ApiResponse<PinResponse>>('/pins', {
            method: 'POST',
            body: pinForm,
        })
        return response
    } catch (error) {
        console.log(error)
        return false
    }
}
