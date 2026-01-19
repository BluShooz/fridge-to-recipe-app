import { NextRequest, NextResponse } from 'next/server';
import { detectIngredients } from '@/lib/vision';

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();
        if (!image) {
            return NextResponse.json({ error: 'Image is required' }, { status: 400 });
        }

        const ingredients = await detectIngredients(image);
        return NextResponse.json({ ingredients });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Analysis failed';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
