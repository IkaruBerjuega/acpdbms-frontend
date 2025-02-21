// Triangle.js
import React from "react";

interface Triangle {
  direction: "up" | "down" | "left" | "right";
  size: string;
}

export default function Triangle({
  direction = "down",
  size = "10",
}: Triangle) {
  const directions = {
    up: "border-t-transparent border-b-transparent border-l-transparent border-r-transparent border-t-0",
    down: "border-t-transparent border-b-transparent border-l-transparent border-r-transparent border-b-0",
    left: "border-t-transparent border-b-transparent border-l-transparent border-r-transparent border-l-0",
    right: `border-t-transparent border-b-transparent border-l-transparent border-r-transparent border-r-0`,
  };

  return (
    <div
      className={`w-0 h-0 border-solid border-t-${size}  border-l-${size} border-r-${size} ${directions[direction]}`}
    ></div>
  );
}
