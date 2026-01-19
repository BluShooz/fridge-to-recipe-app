'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Tag } from 'lucide-react';

interface IngredientListProps {
    ingredients: string[];
    onAdd: (ingredient: string) => void;
    onRemove: (index: number) => void;
}

export default function IngredientList({ ingredients, onAdd, onRemove }: IngredientListProps) {
    const [inputValue, setInputValue] = React.useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Tag className="w-3 h-3" /> Detected Ingredients
                </h2>
                <span className="text-[10px] font-bold bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-700">
                    {ingredients.length} ITEMS
                </span>
            </div>

            <div className="flex flex-wrap gap-2">
                {ingredients.map((ing, i) => (
                    <motion.div
                        key={i}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2 bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700/50 pl-4 pr-2 py-2 rounded-2xl shadow-lg"
                    >
                        <span className="text-sm font-semibold text-emerald-400 capitalize">{ing}</span>
                        <button
                            onClick={() => onRemove(i)}
                            className="p-1 hover:bg-rose-500/20 rounded-lg text-zinc-500 hover:text-rose-400 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </motion.div>
                ))}

                <form onSubmit={handleSubmit} className="flex-1 min-w-[180px]">
                    <div className="relative group">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Add more..."
                            className="w-full bg-zinc-900/50 border border-dashed border-zinc-700 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-emerald-500/50 focus:bg-zinc-900/80 text-white placeholder:text-zinc-600 transition-all"
                        />
                        <motion.button
                            type="submit"
                            whileTap={{ scale: 0.9 }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl text-emerald-500 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
}
