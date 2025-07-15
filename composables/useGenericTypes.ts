interface ApiResponse<T = Record<string, unknown>> {
    code: number;
    data?: T;
    message?: string;
}

interface FileUploadResult {
    path: string;
    text: string;
}

type FileUploadResponse = ApiResponse<FileUploadResult>

export type {
    ApiResponse,
    FileUploadResult,
    FileUploadResponse,
}
