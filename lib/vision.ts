import { normalizeIngredients } from './normalize';
import { VisionApiResponse } from './vision-types';

export async function detectIngredients(base64Image: string) {
    const apiKey = process.env.VISION_API_KEY;
    if (!apiKey) throw new Error('VISION_API_KEY is not set');

    // Remove data URL prefix if present
    const base64 = base64Image.replace(/^data:image\/\w+;base64,/, '');

    try {
        const response = await fetch(
            `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requests: [
                        {
                            image: {
                                content: base64,
                            },
                            features: [
                                {
                                    type: 'LABEL_DETECTION',
                                    maxResults: 20,
                                },
                                {
                                    type: 'OBJECT_LOCALIZATION',
                                    maxResults: 20,
                                },
                            ],
                        },
                    ],
                }),
            }
        );

        const data: VisionApiResponse = await response.json();

        if (data.error) {
            console.error('Vision API Error:', data.error);
            throw new Error(data.error.message);
        }

        const labels = data.responses?.[0]?.labelAnnotations?.map((l) => l.description) || [];
        const objects = data.responses?.[0]?.localizedObjectAnnotations?.map((o) => o.name) || [];

        const combined = Array.from(new Set([...labels, ...objects]));
        return normalizeIngredients(combined);
    } catch (error) {
        console.error('Failed to detect ingredients:', error);
        return [];
    }
}
