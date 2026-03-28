import { useRef, useState } from "react";
// import { socket } from "../socket";
import { getMousePos } from "../utils/getMousePos";
import { drawSmoothStroke } from "../utils/smoothPath";
import { pointsToSmoothSVG } from "../utils/svgPath";

export function useDraw(canvasRef) {
  const [strokes, setStrokes] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [color, setColor] = useState("black");
  const [size, setSize] = useState(4);

  const currentStroke = useRef([]);
  const isDrawing = useRef(false);

//   // receive from server
//   useEffect(() => {
//     socket.on("init", setStrokes);
//     socket.on("draw", (stroke) => {
//       setStrokes((prev) => [...prev, stroke]);
//     });

//     return () => {
//       socket.off("init");
//       socket.off("draw");
//     };
//   }, []);

  const startDrawing = (e) => {
    const pos = getMousePos(e, canvasRef.current);
    isDrawing.current = true;
    currentStroke.current = [{ ...pos, color, size }];
  };

  const draw = (e) => {
    if (!isDrawing.current) return;

    const ctx = canvasRef.current.getContext("2d");
    const pos = getMousePos(e, canvasRef.current);

    currentStroke.current.push({ ...pos, color, size });

    ctx.strokeStyle = color;
    ctx.lineWidth = size;

    drawSmoothStroke(ctx, currentStroke.current);
  };

  const endDrawing = () => {
    if (!isDrawing.current) return;

    isDrawing.current = false;

    const stroke = currentStroke.current;

    // socket.emit("draw", stroke);
    setStrokes((prev) => [...prev, stroke]);
    setRedoStack([]);

    currentStroke.current = [];
  };

  // 🔁 UNDO
  const undo = () => {
    if (strokes.length === 0) return;

    const last = strokes[strokes.length - 1];
    setRedoStack((prev) => [...prev, last]);
    setStrokes((prev) => prev.slice(0, -1));
  };

  // 🔁 REDO
  const redo = () => {
    if (redoStack.length === 0) return;

    const last = redoStack[redoStack.length - 1];
    setStrokes((prev) => [...prev, last]);
    setRedoStack((prev) => prev.slice(0, -1));
  };

  // 📤 EXPORT SVG
  const exportSVG = () => {
    const paths = strokes.map((stroke) => {
      const d = pointsToSmoothSVG(stroke);
      return `<path d="${d}" stroke="${stroke[0].color}" fill="none" stroke-width="${stroke[0].size}" />`;
    });

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg">
        ${paths.join("")}
      </svg>
    `;

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drawing.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    strokes,
    startDrawing,
    draw,
    endDrawing,
    undo,
    redo,
    exportSVG,
    color,
    setColor,
    size,
    setSize,
  };
}