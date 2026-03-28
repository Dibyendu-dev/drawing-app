import { useEffect } from "react";
import { drawSmoothStroke } from "../utils/smoothPath";

export default function CanvasBoard({
  canvasRef,
  strokes,
  startDrawing,
  draw,
  endDrawing,
}) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.lineCap = "round";
  }, [canvasRef]);

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

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      style={{ border: "1px solid black" }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
    />
  );
}
