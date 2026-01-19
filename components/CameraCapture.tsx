'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Camera, RefreshCw, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface CameraCaptureProps {
    onCapture: (base64Image: string) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [isStarting, setIsStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Use effect to set stream to video element once it's mounted
    React.useEffect(() => {
        if (stream && videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.error("Video play failed:", e));
        }
    }, [stream]);

    const startCamera = useCallback(async () => {
        setIsStarting(true);
        setError(null);
        try {
            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false,
            };

            let mediaStream: MediaStream;
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            } catch (err) {
                console.warn('FacingMode environment failed, trying default', err);
                // Fallback to simpler constraints
                mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            }

            setStream(mediaStream);
        } catch (err) {
            console.error('Error accessing camera:', err);
            const msg = err instanceof Error ? err.message : 'Unknown camera error';
            setError(`Camera Error: ${msg}`);
            alert(`Camera access failed: ${msg}. Please ensure you have granted permissions and are using HTTPS.`);
        } finally {
            setIsStarting(false);
        }
    }, []);

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                const base64 = canvas.toDataURL('image/jpeg', 0.8);

                // Stop stream
                stream?.getTracks().forEach(track => track.stop());
                setStream(null);

                onCapture(base64);
            }
        }
    };

    if (!stream) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                    className="relative mb-12"
                >
                    <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-full" />
                    <div className="relative bg-zinc-900 border border-zinc-800 p-8 rounded-full shadow-2xl">
                        <Camera className="w-16 h-16 text-emerald-400" />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-emerald-500 p-2 rounded-full shadow-lg">
                        <Zap className="w-4 h-4 text-white fill-current" />
                    </div>
                </motion.div>

                <h1 className="text-4xl font-black mb-4 tracking-tight text-white uppercase italic">
                    Fridge <span className="text-emerald-500">Vision</span>
                </h1>
                <p className="text-zinc-400 mb-8 max-w-xs text-sm font-medium leading-relaxed">
                    AI-powered ingredient detection. Just snap a photo of your fridge and let the magic happen.
                </p>

                <button
                    onClick={startCamera}
                    disabled={isStarting}
                    className="group relative w-full max-w-xs overflow-hidden rounded-2xl bg-emerald-500 px-8 py-5 transition-all hover:bg-emerald-400 active:scale-95 disabled:opacity-50"
                >
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <span className="relative flex items-center justify-center gap-3 text-lg font-bold text-black uppercase tracking-wider">
                        {isStarting ? <RefreshCw className="animate-spin" /> : <Camera className="w-6 h-6" />}
                        Snap Your Fridge
                    </span>
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="flex-1 object-cover w-full h-full"
            />
            {error && (
                <div className="absolute top-4 left-4 right-4 bg-rose-500/80 p-3 rounded-lg text-white text-xs z-50">
                    {error}
                </div>
            )}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center px-8">
                <button
                    onClick={capturePhoto}
                    className="relative w-24 h-24 rounded-full bg-white p-1 shadow-2xl active:scale-90 transition-transform"
                >
                    <div className="w-full h-full rounded-full border-4 border-black/10 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-500 shadow-inner" />
                    </div>
                </button>

                <button
                    onClick={() => {
                        stream?.getTracks().forEach(track => track.stop());
                        setStream(null);
                    }}
                    className="absolute right-12 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                >
                    <RefreshCw className="w-8 h-8" />
                </button>
            </div>
        </div>
    );
}
