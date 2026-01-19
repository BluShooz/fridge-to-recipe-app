'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
}

export default function LoadingState({ message = 'Analyzing your fridge...' }: LoadingStateProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
            <div className="relative mb-8">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="w-32 h-32 border-t-4 border-emerald-500 rounded-full blur-sm absolute inset-0"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="w-32 h-32 border-r-4 border-emerald-400 rounded-full blur-sm absolute inset-0"
                />
                <div className="w-32 h-32 flex items-center justify-center bg-zinc-900 rounded-full relative z-10 border border-zinc-800">
                    <Loader2 className="w-12 h-12 text-emerald-400 animate-spin" />
                </div>
            </div>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-white uppercase tracking-widest italic"
            >
                {message}
            </motion.p>

            <div className="mt-4 flex gap-1">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2 h-2 bg-emerald-500 rounded-full"
                    />
                ))}
            </div>
        </div>
    );
}
