import React from "react";

interface HeaderProps {
  status: "ready" | "playing" | "gameover" | "win";
  points: number;
  inputPoints: string;
  onPointsChange: (val: string) => void;
  time: number;
  onStart: () => void;
  onAutoPlay: () => void;
  autoPlaying: boolean;
}

function Header({
  status,
  points,
  inputPoints,
  onPointsChange,
  time,
  onStart,
  onAutoPlay,
  autoPlaying,
}: HeaderProps) {
  let title = "LET'S PLAY";
  let titleColor = undefined;
  if (status === "gameover") {
    title = "GAME OVER";
    titleColor = "red";
  }
  if (status === "win") {
    title = "ALL CLEARED";
    titleColor = "green";
  }
  const isRestart = status === "playing";
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ color: titleColor }}>{title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>Points:</span>
        <input
          type="number"
          min={1}
          max={99}
          value={inputPoints}
          onChange={(e) => onPointsChange(e.target.value)}
          disabled={status === "playing"}
          style={{ width: 60 }}
        />
      </div>
      <div style={{ marginTop: 8 }}>Time: {time.toFixed(1)}s</div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={onStart} disabled={!points}>
          {isRestart ? "Restart" : "Start"}
        </button>
        {status === "playing" && (
          <button onClick={onAutoPlay}>
            {autoPlaying ? "Autoplay Off" : "Autoplay On"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;
