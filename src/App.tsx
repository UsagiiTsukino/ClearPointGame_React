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

function App() {
  const [inputPoints, setInputPoints] = useState("");
  const [points, setPoints] = useState(0);
  const [circles, setCircles] = useState<CircleData[]>([]);
  const [gameStatus, setGameStatus] = useState<
    "ready" | "playing" | "gameover" | "win"
  >("ready");
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const autoPlayRef = useRef(false);
  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  const circlesRef = useRef(circles);
  useEffect(() => {
    circlesRef.current = circles;
  }, [circles]);

  // Timer effect
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTime((t) => +(t + 0.1).toFixed(1));
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
    if (!isNaN(n) && n > 0 && n <= 99999) setPoints(n);
    else setPoints(0);
  };

  // Start hoặc Restart game
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
          (c) =>
            Math.abs(c.left - pos.left) < CIRCLE_SIZE &&
            Math.abs(c.top - pos.top) < CIRCLE_SIZE
        ) &&
        tries < 100
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
    // Chỉ cho phép bấm đúng thứ tự tiếp theo (index = currentIndex)
    if (i !== currentIndex) {
      setGameStatus("gameover");
      setTimerActive(false);
      return;
    }
    // Đánh dấu vòng tròn này là active, bắt đầu đếm ngược 3s
    setCircles((prev) =>
      prev.map((c, idx) =>
        idx === i ? { ...c, state: "active", countdown: 3.0 } : c
      )
    );
    // Tăng currentIndex để cho phép bấm tiếp vòng tròn tiếp theo
    setCurrentIndex((idx) => idx + 1);
  };

  // Countdown effect cho tất cả các circle active
  useEffect(() => {
    if (gameStatus !== "playing") return;
    // Nếu không có circle nào active thì không cần setInterval
    if (!circles.some((c) => c.state === "active")) return;
    const interval = setInterval(() => {
      setCircles((prev) =>
        prev.map((c) => {
          if (c.state !== "active" || c.countdown === undefined) return c;
          if (c.countdown <= 0.1) return { ...c, state: "hidden" };
          return { ...c, countdown: +(c.countdown - 0.1).toFixed(1) };
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, [circles, gameStatus]);

  // Check win
  useEffect(() => {
    if (
      gameStatus === "playing" &&
      circles.length > 0 &&
      circles.every((c) => c.state === "hidden")
    ) {
      setGameStatus("win");
      setTimerActive(false);
    }
  }, [circles, gameStatus]);

  // Auto Play
  const handleAutoPlay = () => {
    if (autoPlaying || gameStatus !== "playing") return;
    setAutoPlaying(true);
  };

  // Effect: mỗi khi autoPlaying và currentIndex thay đổi, tự động bấm tiếp nếu còn chơi
  useEffect(() => {
    if (!autoPlaying) return;
    if (gameStatus !== "playing") return;
    if (currentIndex >= circles.length) {
      setAutoPlaying(false);
      return;
    }
    // Bấm vào currentIndex
    const timer = setTimeout(() => {
      handleCircleClick(currentIndex);
    }, 400);
    return () => clearTimeout(timer);
  }, [autoPlaying, currentIndex, gameStatus, circles.length]);

  // Khi win/gameover thì dừng auto play
  useEffect(() => {
    if (gameStatus === "win" || gameStatus === "gameover") {
      setAutoPlaying(false);
      autoPlayRef.current = false;
    }
  }, [gameStatus]);

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
        showAutoPlay={gameStatus === "playing" && !autoPlaying}
      />
      <PlayArea circles={circles} onCircleClick={handleCircleClick} />
      {gameStatus === "playing" && (
        <div style={{ marginTop: 16, fontWeight: 500, fontSize: 18 }}>
          Next: <span style={{ color: "#1976d2" }}>{currentIndex + 1}</span>
        </div>
      )}
    </div>
  );
}

export default App;
