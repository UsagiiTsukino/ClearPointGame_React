import React from "react";

interface HeaderProps {
  status: "ready" | "playing" | "gameover" | "win";
  points: number;
  inputPoints: string;
  onPointsChange: (val: string) => void;
  time: number;
  onStart: () => void;
  onAutoPlay: () => void;
  showAutoPlay: boolean;
}

const Header: React.FC<HeaderProps> = ({
  status,
  points,
  inputPoints,
  onPointsChange,
  time,
  onStart,
  onAutoPlay,
  showAutoPlay,
}) => {
  let title = "LET'S PLAY";
  let titleColor = undefined;
  if (status === "gameover") title = "GAME OVER";
  if (status === "win") {
    title = "YOU WIN";
    titleColor = "green";
  }
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
          onChange={e => onPointsChange(e.target.value)}
          disabled={status === "playing"}
          style={{ width: 60 }}
        />
      </div>
      <div style={{ marginTop: 8 }}>Time: {time.toFixed(1)}s</div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={onStart} disabled={status === "playing" || !points}>Start</button>
        {showAutoPlay && (
          <button onClick={onAutoPlay}>Auto Play</button>
        )}
      </div>
    </div>
  );
};

export default Header; 