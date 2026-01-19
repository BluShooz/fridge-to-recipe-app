export interface VisionApiResponse {
  responses: Array<{
    labelAnnotations?: Array<{ description: string }>;
    localizedObjectAnnotations?: Array<{ name: string }>;
  }>;
  error?: { message: string };
}
