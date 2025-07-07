import React, { useState, useRef, useEffect } from "react";
import Header from "./components/Header";
import PlayArea, { CircleData } from "./components/PlayArea";

const AREA_WIDTH = 400;
const AREA_HEIGHT = 300;
const CIRCLE_SIZE = 25;

const getRandomPosition = () => {
  const left = Math.random() * (AREA_WIDTH - CIRCLE_SIZE);
  const top = Math.random() * (AREA_HEIGHT - CIRCLE_SIZE);
  return { left, top };
};

const App: React.FC = () => {
  const [inputPoints, setInputPoints] = useState("");
  const [points, setPoints] = useState(0);
  const [circles, setCircles] = useState<CircleData[]>([]);
  const [gameStatus, setGameStatus] = useState<"ready" | "playing" | "gameover" | "win">("ready");
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTime(t => +(t + 0.1).toFixed(1));
      }, 100);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  // Handle input change
  const handlePointsChange = (val: string) => {
    setInputPoints(val);
    const n = parseInt(val, 10);
    if (!isNaN(n) && n > 0 && n <= 99) setPoints(n);
    else setPoints(0);
  };

  // Start game
  const handleStart = () => {
    if (!points) return;
    // Generate random circles
    const arr: CircleData[] = [];
    for (let i = 0; i < points; ++i) {
      let pos: { left: number; top: number };
      let tries = 0;
      do {
        pos = getRandomPosition();
        tries++;
      } while (
        arr.some(
          c =>
            Math.abs(c.left - pos.left) < CIRCLE_SIZE &&
            Math.abs(c.top - pos.top) < CIRCLE_SIZE
        ) && tries < 100
      );
      arr.push({ index: i, left: pos.left, top: pos.top, state: "normal" });
    }
    setCircles(arr);
    setGameStatus("playing");
    setTime(0);
    setTimerActive(true);
    setCurrentIndex(0);
  };

  // Handle click circle
  const handleCircleClick = (i: number) => {
    if (gameStatus !== "playing") return;
    if (i !== currentIndex) {
      setGameStatus("gameover");
      setTimerActive(false);
      return;
    }
    // Đánh dấu active, bắt đầu đếm ngược 3s
    setCircles(prev =>
      prev.map((c, idx) =>
        idx === i ? { ...c, state: "active", countdown: 3.0 } : c
      )
    );
    setCurrentIndex(idx => idx + 1);
  };

  // Countdown effect cho circle active
  useEffect(() => {
    if (gameStatus !== "playing") return;
    const activeIdx = circles.findIndex(c => c.state === "active");
    if (activeIdx === -1) return;
    const interval = setInterval(() => {
      setCircles(prev =>
        prev.map((c, idx) => {
          if (idx !== activeIdx || c.state !== "active" || c.countdown === undefined) return c;
          if (c.countdown! <= 0.1) return { ...c, state: "hidden" };
          return { ...c, countdown: +(c.countdown! - 0.1).toFixed(1) };
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, [circles, gameStatus]);

  // Check win
  useEffect(() => {
    if (gameStatus === "playing" && circles.length > 0 && circles.every(c => c.state === "hidden")) {
      setGameStatus("win");
      setTimerActive(false);
    }
  }, [circles, gameStatus]);

  // Restart game
  const handleRestart = () => {
    setGameStatus("ready");
    setCircles([]);
    setTime(0);
    setTimerActive(false);
    setCurrentIndex(0);
  };

  // Auto Play (placeholder, sẽ làm sau)
  const handleAutoPlay = () => {
    // Sẽ cài đặt sau
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 24 }}>
      <Header
        status={gameStatus}
        points={points}
        inputPoints={inputPoints}
        onPointsChange={handlePointsChange}
        time={time}
        onStart={handleStart}
        onAutoPlay={handleAutoPlay}
        showAutoPlay={gameStatus === "playing"}
      />
      <PlayArea circles={circles} onCircleClick={handleCircleClick} />
      {(gameStatus === "gameover" || gameStatus === "win") && (
        <div style={{ marginTop: 24 }}>
          <button onClick={handleRestart}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default App;
