export interface Recipe {
    id: number;
    title: string;
    image: string;
    usedIngredientCount: number;
    missedIngredientCount: number;
    missedIngredients: { name: string }[];
    usedIngredients: { name: string }[];
    matchPercentage: number;
}

export async function getRecipesByIngredients(ingredients: string[]): Promise<Recipe[]> {
    const apiKey = process.env.SPOONACULAR_API_KEY;
    if (!apiKey) throw new Error('SPOONACULAR_API_KEY is not set');

    const ingredientsParam = ingredients.join(',');

    try {
        const response = await fetch(
            `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${encodeURIComponent(
                ingredientsParam
            )}&number=5&ranking=1&apiKey=${apiKey}`
        );

        const data = await response.json();

        if (data.status === 'failure') {
            throw new Error(data.message);
        }

        return (data as Recipe[]).map((recipe) => {
            const total = recipe.usedIngredientCount + recipe.missedIngredientCount;
            const matchPercentage = total > 0 ? Math.round((recipe.usedIngredientCount / total) * 100) : 0;

            return {
                id: recipe.id,
                title: recipe.title,
                image: recipe.image,
                usedIngredientCount: recipe.usedIngredientCount,
                missedIngredientCount: recipe.missedIngredientCount,
                missedIngredients: recipe.missedIngredients,
                usedIngredients: recipe.usedIngredients,
                matchPercentage,
            };
        });
    } catch (error) {
        console.error('Failed to fetch recipes:', error);
        return [];
    }
}
