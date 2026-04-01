import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
import { Track } from '../types';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Cyber City Nights',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/cyber/400/400'
  },
  {
    id: '2',
    title: 'Neon Pulse',
    artist: 'Digital Dreams',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/neon/400/400'
  },
  {
    id: '3',
    title: 'Retro Future',
    artist: 'Glitch Master',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/retro/400/400'
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-md bg-black rounded-3xl p-6 border-2 border-magenta/30 shadow-[0_0_30px_rgba(255,0,255,0.1)] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1 h-full bg-magenta/20 animate-pulse" />
      
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="relative aspect-square mb-6 group overflow-hidden border-2 border-magenta/50">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentTrack.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-full h-full object-cover grayscale contrast-150 brightness-75"
            referrerPolicy="no-referrer"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-magenta/20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none" />
        
        {isPlaying && (
          <div className="absolute bottom-4 left-4 flex gap-1 items-end h-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                animate={{ height: [4, 28, 8, 32, 4] }}
                transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                className="w-1.5 bg-cyan shadow-[0_0_10px_var(--color-cyan)]"
              />
            ))}
          </div>
        )}
      </div>

      <div className="mb-6 font-mono-retro">
        <h3 className="text-3xl font-bold text-cyan truncate glitch-text" data-text={currentTrack.title}>{currentTrack.title}</h3>
        <p className="text-magenta/80 text-lg tracking-widest">&gt; {currentTrack.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 w-full bg-magenta/10 border border-magenta/30 overflow-hidden cursor-pointer">
          <motion.div 
            className="h-full bg-magenta shadow-[0_0_15px_var(--color-magenta)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-magenta/60 font-mono-retro tracking-widest">
          <span>{audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ":" + Math.floor(audioRef.current.currentTime % 60).toString().padStart(2, '0') : "0:00"}</span>
          <span>[ TRACK_LENGTH ]</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between font-pixel">
        <button className="text-cyan/40 hover:text-cyan transition-colors">
          <Volume2 size={18} />
        </button>
        
        <div className="flex items-center gap-6">
          <button 
            onClick={prevTrack}
            className="text-cyan hover:text-magenta transition-colors"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-14 h-14 flex items-center justify-center bg-cyan text-black hover:bg-magenta transition-all shadow-[0_0_20px_var(--color-cyan)]"
          >
            {isPlaying ? <Pause size={28} fill="black" /> : <Play size={28} fill="black" className="ml-1" />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-cyan hover:text-magenta transition-colors"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        <button className="text-cyan/40 hover:text-cyan transition-colors">
          <Music size={18} />
        </button>
      </div>
    </div>
  );
};
