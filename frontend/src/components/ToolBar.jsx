export default function Toolbar({
  undo,
  redo,
  exportSVG,
  color,
  setColor,
  size,
  setSize,
}) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <button onClick={undo}>Undo</button>
      <button onClick={redo}>Redo</button>
      <button onClick={exportSVG}>Export SVG</button>

      <label style={{ marginLeft: "10px" }}>
        Color:
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>

      <label style={{ marginLeft: "10px" }}>
        Size:
        <input
          type="range"
          min="1"
          max="20"
          value={size}
          onChange={(e) => setSize(e.target.value)}
        />
      </label>
    </div>
  );
}