import React from "react";

interface CircleProps {
  index: number;
  left: number;
  top: number;
  state: "normal" | "active" | "hidden";
  countdown?: number;
  onClick: () => void;
}

function Circle({ index, left, top, state, countdown, onClick }: CircleProps) {
  if (state === "hidden") return null;
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        left,
        top,
        width: 25,
        height: 25,
        borderRadius: "50%",
        background: state === "active" ? "orange" : "#eee",
        color: "#222",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid #aaa",
        cursor: state === "normal" ? "pointer" : "default",
        fontWeight: 600,
        fontSize: 14,
        userSelect: "none",
        transition: "background 0.2s, opacity 0.2s",
        zIndex: 1,
        opacity:
          state === "active" && countdown !== undefined
            ? Math.max(0, Math.min(1, countdown / 3))
            : 1,
      }}
    >
      {state === "active" && countdown !== undefined
        ? countdown.toFixed(1)
        : index + 1}
    </div>
  );
}

export default Circle;
