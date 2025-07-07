import React from "react";
import Circle from "./Circle";

export interface CircleData {
  index: number;
  left: number;
  top: number;
  state: "normal" | "active" | "hidden";
  countdown?: number;
}

interface PlayAreaProps {
  circles: CircleData[];
  onCircleClick: (index: number) => void;
}

const AREA_WIDTH = 400;
const AREA_HEIGHT = 300;

function PlayArea({ circles, onCircleClick }: PlayAreaProps) {
  return (
    <div
      style={{
        position: "relative",
        width: AREA_WIDTH,
        height: AREA_HEIGHT,
        border: "2px solid #333",
        margin: "0 auto",
        background: "#fafafa",
      }}
    >
      {circles.map((circle, i) => (
        <Circle
          key={i}
          index={circle.index}
          left={circle.left}
          top={circle.top}
          state={circle.state}
          countdown={circle.countdown}
          onClick={() => onCircleClick(i)}
        />
      ))}
    </div>
  );
}

export default PlayArea; 