'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCcw, Sparkles } from 'lucide-react';
import CameraCapture from '@/components/CameraCapture';
import IngredientList from '@/components/IngredientList';
import RecipeCard from '@/components/RecipeCard';
import LoadingState from '@/components/LoadingState';
import type { Recipe } from '@/lib/recipes';

type AppState = 'IDLE' | 'ANALYZING' | 'LISTING' | 'FETCHING_RECIPES' | 'RESULTS';

export default function Home() {
  const [state, setState] = useState<AppState>('IDLE');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCapture = async (base64: string) => {
    setState('ANALYZING');
    setError(null);
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setIngredients(data.ingredients);
      setState('LISTING');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      setState('IDLE');
    }
  };

  const fetchRecipes = async () => {
    setState('FETCHING_RECIPES');
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setRecipes(data.recipes);
      setState('RESULTS');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch recipes');
      setState('LISTING');
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-emerald-500/30">
      <div className="max-w-2xl mx-auto px-6 py-12 md:py-20">

        <AnimatePresence mode="wait">
          {state === 'IDLE' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <CameraCapture onCapture={handleCapture} />
            </motion.div>
          )}

          {state === 'ANALYZING' && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingState message="Visual recognition active..." />
            </motion.div>
          )}

          {state === 'LISTING' && (
            <motion.div
              key="listing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <h1 className="text-5xl font-black italic uppercase tracking-tight leading-none text-white">
                  Found <span className="text-emerald-500">Elements</span>
                </h1>
                <p className="text-zinc-500 font-medium">Verify the detected ingredients or add missing ones before searching recipes.</p>
              </div>

              <IngredientList
                ingredients={ingredients}
                onAdd={(ing) => setIngredients([...ingredients, ing])}
                onRemove={(index) => setIngredients(ingredients.filter((_, i) => i !== index))}
              />

              <div className="flex flex-col gap-4">
                <button
                  onClick={fetchRecipes}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-black py-5 rounded-2xl font-black uppercase tracking-widest text-lg flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Find Matching Recipes <ArrowRight className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setState('IDLE')}
                  className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors"
                >
                  <RefreshCcw className="w-4 h-4" /> Start Over
                </button>
              </div>
            </motion.div>
          )}

          {state === 'FETCHING_RECIPES' && (
            <motion.div key="fetching" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingState message="Scanning recipe database..." />
            </motion.div>
          )}

          {state === 'RESULTS' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-500">
                  <Sparkles className="w-5 h-5 fill-current" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">AI Selected</span>
                </div>
                <h1 className="text-5xl font-black italic uppercase tracking-tight leading-none text-white">
                  The <span className="text-emerald-500">Menu</span>
                </h1>
                <p className="text-zinc-500 font-medium">Top {recipes.length} recipe suggestions based on your fridge scan.</p>
              </div>

              <div className="grid gap-6">
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>

              <button
                onClick={() => setState('IDLE')}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 py-6 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all hover:text-white"
              >
                <RefreshCcw className="w-5 h-5" /> New Scan
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-8 left-6 right-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-center font-bold text-sm z-[100] backdrop-blur-xl"
          >
            {error}
          </motion.div>
        )}
      </div>

      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-0 right-[-10%] w-[50%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-[-10%] w-[50%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>
    </main>
  );
}
