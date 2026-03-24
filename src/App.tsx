import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 font-pixel relative overflow-hidden text-cyan-glitch">
      <div className="static-noise" />
      <div className="scanlines" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8">
        <header className="text-center mb-2">
          <h1 
            className="text-6xl md:text-8xl font-bold tracking-widest glitch-text uppercase" 
            data-text="SYS.SNAKE_PROTOCOL"
          >
            SYS.SNAKE_PROTOCOL
          </h1>
          <p className="text-magenta-glitch mt-2 text-xl md:text-2xl uppercase tracking-widest animate-pulse">
            &gt; STATUS: INITIALIZING... GLITCH_MODE: ACTIVE
          </p>
        </header>

        <div className="flex flex-col lg:flex-row w-full gap-12 items-center lg:items-start justify-center">
          
          <div className="flex flex-col items-center gap-6 w-full max-w-md">
            <div className="w-full flex justify-between items-center bg-black glitch-border p-4">
              <span className="text-magenta-glitch text-2xl uppercase tracking-widest">&gt;&gt; SCORE_DATA</span>
              <span className="text-4xl font-bold text-cyan-glitch">
                {score.toString().padStart(4, '0')}
              </span>
            </div>

            <SnakeGame onScoreUpdate={setScore} />
            
            <div className="text-magenta-glitch text-lg text-center mt-2 uppercase">
              [INPUT: WASD/ARROWS] [PAUSE: SPACE]
            </div>
          </div>

          <div className="w-full max-w-md flex flex-col justify-center h-full pt-0 lg:pt-20">
            <MusicPlayer />
          </div>

        </div>
      </div>
    </div>
  );
}
