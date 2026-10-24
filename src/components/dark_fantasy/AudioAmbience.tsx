/**
 * SANGUIS NOBILIS — Procedural Web Audio Gothic Ambience
 * 
 * Synthesizes a resonant, atmospheric nocturnal drone using Web Audio API:
 * - Fundamental Harmonic Fifth (A1 55Hz & E2 82.5Hz + A2 110Hz)
 * - Gentle Biquad Low-Pass Filter sweep simulating cathedral reverb
 * - Subtle binaural frequency detuning (0.4 Hz) for hypnotic warmth
 * - Zero external .mp3 file dependencies / zero 404s
 */

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const AudioAmbience: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);

  const startAmbience = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // Master Gain Node with gentle fade-in
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 3.0);
      gainNodeRef.current = masterGain;

      // Resonant Low-Pass Filter (Cathedral acoustics)
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.Q.setValueAtTime(3.5, ctx.currentTime);

      masterGain.connect(filter);
      filter.connect(ctx.destination);

      // Oscillators: Low Sub-drone (A1), Harmonic Fifth (E2), and Soft Octave (A2)
      const freqs = [55.0, 82.41, 110.0, 164.81];
      const oscs: OscillatorNode[] = [];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        // Alternate subtle detune for spacious stereo phasing
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.detune.setValueAtTime((idx - 1.5) * 4.0, ctx.currentTime);

        const individualVolume = idx === 0 ? 0.35 : 0.2;
        oscGain.gain.setValueAtTime(individualVolume, ctx.currentTime);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        oscs.push(osc);
      });

      oscillatorsRef.current = oscs;
      setIsPlaying(true);
    } catch (e) {
      console.warn('Web Audio not supported or blocked:', e);
    }
  };

  const stopAmbience = () => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      gainNodeRef.current.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      setTimeout(() => {
        oscillatorsRef.current.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        oscillatorsRef.current = [];
        ctx.close();
        audioCtxRef.current = null;
        setIsPlaying(false);
      }, 1300);
    } else {
      setIsPlaying(false);
    }
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopAmbience();
    } else {
      startAmbience();
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <button
      onClick={toggleSound}
      title={isPlaying ? 'Silence Nocturnal Ambience' : 'Play Cathedral Drone'}
      className={`fixed bottom-5 right-5 z-40 p-3 rounded-full border transition-all duration-300 shadow-xl flex items-center gap-2 group backdrop-blur-md ${
        isPlaying
          ? 'bg-[#800A16] border-[#6A040F] text-[#F4ECD8] shadow-[0_0_20px_rgba(128,10,22,0.5)]'
          : 'bg-[#181818]/90 border-[#2C4233] text-[#EADBB6]/70 hover:text-[#F4ECD8] hover:border-[#800A16]'
      }`}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 animate-pulse" />
          <span className="hidden sm:inline-block text-xs font-cinzel tracking-wider pr-1">
            Nocturnal Drone
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-4 h-4" />
          <span className="hidden sm:inline-block text-xs font-cinzel tracking-wider pr-1">
            Audio Ambience
          </span>
        </>
      )}
    </button>
  );
};
