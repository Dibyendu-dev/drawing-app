import { useEffect, useRef } from "react";
import { drawSmoothStroke } from "../utils/smoothPath";

export default function CanvasBoard({
  canvasRef,
  strokes,
  startDrawing,
  draw,
  endDrawing,
}) {
  const containerRef = useRef(null);

  // Set canvas size to match container
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const rect = container.getBoundingClientRect();
      // Account for padding
      const padding = 32; // 16px * 2 (p-4)
      const width = Math.floor(rect.width - padding);
      const height = Math.floor(rect.height - padding);

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";

      // Redraw strokes after resize
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      strokes.forEach((stroke) => {
        ctx.strokeStyle = stroke[0].color;
        ctx.lineWidth = stroke[0].size;
        drawSmoothStroke(ctx, stroke);
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [canvasRef, strokes]);

  // redraw all strokes when they change (undo/redo)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => {
      ctx.strokeStyle = stroke[0].color;
      ctx.lineWidth = stroke[0].size;
      drawSmoothStroke(ctx, stroke);
    });
  }, [strokes, canvasRef]);

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
    };
    startDrawing(mouseEvent);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const mouseEvent = {
      clientX: touch.clientX,
      clientY: touch.clientY,
    };
    draw(mouseEvent);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    endDrawing();
  };

  return (
    <div ref={containerRef} className="w-full h-full min-h-[250px] sm:min-h-[300px] bg-gray-50 rounded-xl shadow-lg p-2 sm:p-4 border border-gray-200 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-inner border border-gray-300 overflow-hidden w-full h-full touch-none">
        <canvas
          ref={canvasRef}
          className="cursor-crosshair block w-full h-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </div>
  );
}
