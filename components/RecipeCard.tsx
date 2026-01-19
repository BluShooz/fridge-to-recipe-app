'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, ChefHat, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import type { Recipe } from '@/lib/recipes';

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="group bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden hover:border-emerald-500/50 transition-colors"
        >
            <div className="relative aspect-video">
                <Image
                    src={recipe.image}
                    alt={recipe.title}
                    fill
                    unoptimized
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-emerald-500 text-black font-black px-3 py-1 rounded-full text-sm shadow-xl">
                    {recipe.matchPercentage}% MATCH
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 line-clamp-1 group-hover:text-emerald-400 transition-colors">
                    {recipe.title}
                </h3>

                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-500" /> Have ({recipe.usedIngredientCount})
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {recipe.usedIngredients.slice(0, 3).map((ing, i) => (
                                <span key={i} className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-md border border-emerald-500/20">
                                    {ing.name}
                                </span>
                            ))}
                            {recipe.usedIngredients.length > 3 && (
                                <span className="text-xs text-zinc-500">+{recipe.usedIngredients.length - 3} more</span>
                            )}
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <X className="w-3 h-3 text-rose-500" /> Missing ({recipe.missedIngredientCount})
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {recipe.missedIngredients.slice(0, 3).map((ing, i) => (
                                <span key={i} className="text-xs bg-rose-500/10 text-rose-400 px-2 py-1 rounded-md border border-rose-500/20">
                                    {ing.name}
                                </span>
                            ))}
                            {recipe.missedIngredients.length > 3 && (
                                <span className="text-xs text-zinc-500">+{recipe.missedIngredients.length - 3} more</span>
                            )}
                        </div>
                    </div>
                </div>

                <button
                    className="w-full mt-6 py-4 bg-zinc-800 hover:bg-emerald-500 hover:text-black rounded-2xl font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2"
                    onClick={() => window.open(`https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-')}-${recipe.id}`, '_blank')}
                >
                    <ChefHat className="w-4 h-4" />
                    View Recipe
                    <ExternalLink className="w-3 h-3" />
                </button>
            </div>
        </motion.div>
    );
}
