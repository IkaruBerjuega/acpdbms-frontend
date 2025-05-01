"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageZoom({ src, alt, className }: ImageZoomProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset position and scale
  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Zoom in/out functions
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 5));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5));

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;

    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Clean up event listeners
  useEffect(() => {
    const handleMouseUpGlobal = () => {
      setIsDragging(false);
    };

    window.addEventListener("mouseup", handleMouseUpGlobal);
    window.addEventListener("touchend", handleMouseUpGlobal);

    return () => {
      window.removeEventListener("mouseup", handleMouseUpGlobal);
      window.removeEventListener("touchend", handleMouseUpGlobal);
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 relative flex-grow">
      <div
        ref={containerRef}
        className={`relative overflow-hidden border border-gray-200 bg-black-primary rounded-lg ${className}`}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={1000}
            height={1000}
            className="w-full h-full object-contain"
            draggable="false"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 absolute top-4 right-4">
        <Button
          variant="outline"
          size="icon"
          onClick={zoomOut}
          disabled={scale <= 0.5}
          aria-label="Zoom out"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={zoomIn}
          disabled={scale >= 5}
          aria-label="Zoom in"
        >
          <Plus className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={resetView}
          aria-label="Reset view"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
