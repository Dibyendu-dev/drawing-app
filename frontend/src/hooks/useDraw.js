import { useRef, useState } from "react";
import { getMousePos } from "../utils/getMousePos";
import { drawSmoothStroke } from "../utils/smoothPath";
import { DRAW_STATES } from "../constants/drawStates";

export function useDraw(canvasRef) {
  const [strokes, setStrokes] = useState([]);
  const [state, setState] = useState(DRAW_STATES.IDLE);

  const currentStroke = useRef([]);
  const isDrawing = useRef(false);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const pos = getMousePos(e, canvas);

    isDrawing.current = true;
    currentStroke.current = [pos];
    setState(DRAW_STATES.DRAWING);
  };

  const draw = (e) => {
    if (!isDrawing.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const pos = getMousePos(e, canvas);
    currentStroke.current.push(pos);

    // redraw current stroke only
    drawSmoothStroke(ctx, currentStroke.current);
  };

  const endDrawing = () => {
    if (!isDrawing.current) return;

    isDrawing.current = false;
    setState(DRAW_STATES.IDLE);

    setStrokes((prev) => [...prev, currentStroke.current]);
    currentStroke.current = [];
  };

  return {
    strokes,
    startDrawing,
    draw,
    endDrawing,
  };
}