import { useRef, useEffect } from "react";
import { useDraw } from "../hooks/useDraw";
import { drawSmoothStroke } from "../utils/smoothPath";

export default function CanvasBoard() {
  const canvasRef = useRef(null);
  const { strokes, startDrawing, draw, endDrawing } = useDraw(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineCap = "round";
    ctx.lineWidth = 4;
    ctx.strokeStyle = "black";
  }, []);

  // redraw all strokes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => {
      drawSmoothStroke(ctx, stroke);
    });
  }, [strokes]);

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