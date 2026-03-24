import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Moving up
const GAME_SPEED = 120;

type Point = { x: number; y: number };

export default function SnakeGame({ onScoreUpdate }: { onScoreUpdate: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreUpdate(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (directionRef.current.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (directionRef.current.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (directionRef.current.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (directionRef.current.x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused((prev) => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check collision with food
        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(generateFood(newSnake));
          const newScore = score + 10;
          setScore(newScore);
          onScoreUpdate(newScore);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, generateFood, score, onScoreUpdate]);

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto aspect-square bg-black glitch-border overflow-hidden">
      {/* Game Grid */}
      <div
        className="grid w-full h-full p-1"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          gap: '1px',
          backgroundColor: '#111',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`
                transition-none
                ${isHead ? 'bg-[#00FFFF] shadow-[0_0_8px_#00FFFF] z-10' : ''}
                ${isSnake && !isHead ? 'bg-[#00FFFF] opacity-80' : ''}
                ${isFood ? 'bg-[#FF00FF] shadow-[0_0_8px_#FF00FF] animate-pulse' : ''}
                ${!isSnake && !isFood ? 'bg-black' : ''}
              `}
            />
          );
        })}
      </div>

      {/* Overlays */}
      {(gameOver || isPaused) && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 p-4 text-center">
          <h2 
            className="text-5xl font-bold text-magenta-glitch mb-4 glitch-text uppercase"
            data-text={gameOver ? 'FATAL_ERROR' : 'SYSTEM_PAUSED'}
          >
            {gameOver ? 'FATAL_ERROR' : 'SYSTEM_PAUSED'}
          </h2>
          {gameOver && (
            <p className="text-2xl text-cyan-glitch mb-6 uppercase tracking-widest">
              &gt; SCORE_LOG: {score}
            </p>
          )}
          <button
            onClick={gameOver ? resetGame : () => setIsPaused(false)}
            className="glitch-btn px-8 py-3 text-2xl font-bold tracking-widest"
          >
            {gameOver ? 'REBOOT_SYSTEM' : 'RESUME_PROCESS'}
          </button>
        </div>
      )}
    </div>
  );
}
