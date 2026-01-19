import { NextRequest, NextResponse } from 'next/server';
import { getRecipesByIngredients } from '@/lib/recipes';

export async function POST(req: NextRequest) {
    try {
        const { ingredients } = await req.json();
        if (!ingredients || !Array.isArray(ingredients)) {
            return NextResponse.json({ error: 'Ingredients array is required' }, { status: 400 });
        }

        const recipes = await getRecipesByIngredients(ingredients);
        return NextResponse.json({ recipes });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Fetching recipes failed';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
