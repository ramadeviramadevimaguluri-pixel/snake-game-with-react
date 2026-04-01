/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden screen-tear">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-magenta/20 blur-[100px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/20 blur-[100px] rounded-full animate-pulse delay-700" />
      </div>
      
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-12 text-center z-10"
      >
        <h1 
          className="text-6xl md:text-9xl font-pixel font-black tracking-tighter uppercase flex flex-col md:flex-row items-center justify-center leading-none glitch-text"
          data-text="SYSTEM_ERROR"
        >
          <span className="text-cyan">NEON</span>
          <span className="text-magenta">VOID</span>
        </h1>
        <p className="text-magenta font-mono-retro tracking-[0.5em] text-sm mt-4 uppercase opacity-80 animate-pulse">
          [ STATUS: UNSTABLE ] // [ PROTOCOL: SNAKE_V.04 ]
        </p>
      </motion.header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Music Player Section */}
        <motion.section 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4 flex justify-center"
        >
          <div className="p-1 bg-magenta/20 neon-border-magenta rounded-3xl">
            <MusicPlayer />
          </div>
        </motion.section>

        {/* Game Section */}
        <motion.section 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-8 flex justify-center"
        >
          <div className="p-1 bg-cyan/20 neon-border-cyan rounded-2xl">
            <SnakeGame />
          </div>
        </motion.section>
      </main>

      <footer className="mt-12 text-magenta/60 font-mono-retro text-xs uppercase tracking-[0.3em] z-10">
        &gt; ACCESSING_CORE_MEMORY... [ OK ] // &copy; 2026_VOID_OS
      </footer>
    </div>
  );
}
