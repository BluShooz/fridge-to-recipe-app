export const FOOD_KEYWORDS = [
    'fruit', 'vegetable', 'meat', 'dairy', 'bread', 'grain', 'spice', 'herb',
    'egg', 'cheese', 'milk', 'yogurt', 'butter', 'chicken', 'beef', 'pork',
    'fish', 'shrimp', 'apple', 'banana', 'orange', 'tomato', 'potato', 'onion',
    'garlic', 'pepper', 'carrot', 'broccoli', 'spinach', 'lettuce', 'cucumber',
    'lemon', 'lime', 'flour', 'sugar', 'salt', 'oil', 'vinegar', 'pasta', 'rice',
    'bean', 'lentil', 'nut', 'seed', 'honey', 'syrup', 'bottle', 'jar', 'can',
    'container', 'food', 'ingredient', 'produce', 'condiment', 'sauce'
];

export const MAPPING: Record<string, string> = {
    'dairy product': 'milk',
    'bell pepper': 'pepper',
    'capsicum': 'pepper',
    'citrus': 'lemon',
    'allium': 'onion',
    'root vegetable': 'potato',
    'leaf vegetable': 'spinach',
    'poultry': 'chicken',
    'red meat': 'beef',
    'berry': 'strawberry',
    'stone fruit': 'peach',
};

export function normalizeIngredients(labels: string[]): string[] {
    const normalized = labels
        .map(l => l.toLowerCase())
        .filter(l => FOOD_KEYWORDS.some(k => l.includes(k)))
        .map(l => MAPPING[l] || l)
        .filter((v, i, a) => a.indexOf(v) === i); // Deduplicate

    return normalized.length > 0 ? normalized : labels.slice(0, 5);
}
