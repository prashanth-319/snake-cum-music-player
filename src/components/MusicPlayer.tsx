import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'AUDIO.STREAM_01',
    artist: 'SYS.AI_GEN',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12',
  },
  {
    id: 2,
    title: 'AUDIO.STREAM_02',
    artist: 'SYS.AI_GEN',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05',
  },
  {
    id: 3,
    title: 'AUDIO.STREAM_03',
    artist: 'SYS.AI_GEN',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44',
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const total = audioRef.current.duration;
      setCurrentTime(current);
      setDuration(total);
      setProgress((current / total) * 100 || 0);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    if (audioRef.current && duration) {
      const newTime = (newProgress / 100) * duration;
      audioRef.current.currentTime = newTime;
      setProgress(newProgress);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-black glitch-border p-6">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
        onLoadedMetadata={handleTimeUpdate}
      />

      <div className="flex items-center justify-between mb-6 border-b-2 border-magenta-glitch pb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-black border-2 border-cyan-glitch flex items-center justify-center animate-pulse">
            <Music className="w-6 h-6 text-cyan-glitch" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-cyan-glitch uppercase tracking-widest">
              {currentTrack.title}
            </h3>
            <p className="text-lg text-magenta-glitch uppercase tracking-widest">{currentTrack.artist}</p>
          </div>
        </div>
        
        {/* Visualizer bars (fake) */}
        <div className="flex items-end space-x-1 h-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-2 bg-cyan-glitch ${isPlaying ? 'animate-bounce' : 'h-1'}`}
              style={{
                height: isPlaying ? `${Math.random() * 100}%` : '4px',
                animationDelay: `${i * 0.1}s`,
                animationDuration: `${0.1 + Math.random() * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6 group">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="w-full h-2 bg-[#111] appearance-none cursor-pointer accent-magenta-glitch border border-cyan-glitch"
        />
        <div className="flex justify-between mt-2 text-lg text-cyan-glitch tracking-widest">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-magenta-glitch hover:bg-magenta-glitch hover:text-black transition-colors border border-transparent hover:border-magenta-glitch"
          >
            {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (parseFloat(e.target.value) > 0) setIsMuted(false);
            }}
            className="w-20 h-2 bg-[#111] appearance-none cursor-pointer accent-cyan-glitch border border-magenta-glitch"
          />
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handlePrev}
            className="glitch-btn p-2"
          >
            <SkipBack className="w-6 h-6 fill-current" />
          </button>
          
          <button
            onClick={togglePlayPause}
            className="glitch-btn w-14 h-14 flex items-center justify-center"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="glitch-btn p-2"
          >
            <SkipForward className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
