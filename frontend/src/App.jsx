import { useRef } from "react";
import CanvasBoard from "./components/CanvasBoard";
import Toolbar from "./components/ToolBar";
import { useDraw } from "./hooks/useDraw";

export default function App() {
  const canvasRef = useRef(null);

  const draw = useDraw(canvasRef);

  return (
    <div>
      <h2>Mini Canva Multiplayer</h2>

      <Toolbar
        undo={draw.undo}
        redo={draw.redo}
        exportSVG={draw.exportSVG}
        color={draw.color}
        setColor={draw.setColor}
        size={draw.size}
        setSize={draw.setSize}
      />

      <CanvasBoard canvasRef={canvasRef} {...draw} />
    </div>
  );
}