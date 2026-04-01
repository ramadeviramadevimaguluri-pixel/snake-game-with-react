import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 150;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isGameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isGameOver, isPaused]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black rounded-2xl border-2 border-cyan/30 shadow-[0_0_30px_rgba(0,255,255,0.1)] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan/20 animate-pulse" />
      
      <div className="flex justify-between w-full mb-6 px-2 items-end font-mono-retro">
        <div className="text-cyan text-2xl tracking-tighter">
          &gt; DATA_COLLECTED: <span className="text-magenta glitch-text" data-text={score.toString().padStart(4, '0')}>{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="text-magenta text-2xl tracking-tighter uppercase">
          [ {isGameOver ? 'CORE_FAILURE' : isPaused ? 'HALTED' : 'EXECUTING'} ]
        </div>
      </div>

      <div 
        className="relative bg-black border-4 border-cyan/50 rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.2)]"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-30" />

        {/* Snake rendering */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className={`absolute rounded-none transition-all duration-75 ${i === 0 ? 'bg-cyan z-10' : 'bg-cyan/40'}`}
            style={{
              width: '100%',
              height: '100%',
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              boxShadow: i === 0 ? '0 0 15px var(--color-cyan)' : 'none',
              border: '1px solid rgba(0,0,0,0.5)'
            }}
          />
        ))}

        {/* Food rendering */}
        <div
          className="absolute bg-magenta rounded-none animate-bounce"
          style={{
            width: '100%',
            height: '100%',
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            boxShadow: '0 0 20px var(--color-magenta)'
          }}
        />

        {/* Overlay for Game Over / Pause */}
        {(isGameOver || isPaused) && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md">
            {isGameOver ? (
              <>
                <h2 className="text-6xl font-pixel font-black text-magenta mb-8 glitch-text" data-text="FATAL_ERROR">FATAL_ERROR</h2>
                <button 
                  onClick={resetGame}
                  className="px-10 py-4 bg-magenta text-black font-pixel text-sm hover:bg-cyan transition-colors shadow-[0_0_20px_var(--color-magenta)]"
                >
                  REBOOT_SYSTEM
                </button>
              </>
            ) : (
              <>
                <h2 className="text-7xl font-pixel font-black text-cyan mb-10 glitch-text" data-text="SYSTEM_IDLE">SYSTEM_IDLE</h2>
                <button 
                  onClick={() => setIsPaused(false)}
                  className="px-10 py-4 bg-cyan text-black font-pixel text-sm hover:bg-magenta transition-colors shadow-[0_0_20px_var(--color-cyan)]"
                >
                  RESUME_PROCESS
                </button>
                <p className="mt-6 text-magenta/60 text-lg font-mono-retro tracking-[0.2em] animate-pulse">&gt; PRESS_SPACE_TO_INITIALIZE</p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-8 text-xs text-cyan/40 font-mono-retro uppercase tracking-widest">
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 border border-cyan/20 bg-cyan/5">NAV_KEYS</span>
          <span>DIRECTION_INPUT</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 border border-cyan/20 bg-cyan/5">SPACE_BAR</span>
          <span>TOGGLE_STATE</span>
        </div>
      </div>
    </div>
  );
};
