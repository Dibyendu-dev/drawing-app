# Signature.io

A free, web-based drawing and signature application with smooth stroke rendering, built with React and HTML5 Canvas.

![Signature.io](https://signature.io/og-image.png)

## Features

- **Smooth Drawing**: Smooth stroke rendering using quadratic Bézier curves
- **Touch Support**: Fully responsive canvas that works on mobile devices and tablets
- **Undo/Redo**: Infinite undo/redo history for your drawings
- **Export to SVG**: Export your drawings as scalable vector graphics
- **Color Picker**: Choose any color for your strokes
- **Brush Size**: Adjustable brush size from 1 to 20 pixels
- **Mobile Optimized**: Responsive design that works on all screen sizes

## Demo

Visit [https://signature.io](https://signature.io) to try it out.

## How It Works

### Architecture

The application is built with a component-based architecture using React:

```
src/
├── App.jsx              # Main application component
├── components/
│   ├── CanvasBoard.jsx  # Canvas rendering and event handling
│   └── ToolBar.jsx      # Controls for color, size, undo/redo
├── hooks/
│   └── useDraw.js       # Drawing logic and state management
└── utils/
    └── smoothPath.js    # Smooth stroke algorithm
```

### Drawing Algorithm

The app uses **quadratic Bézier curves** to create smooth strokes:

1. **Point Collection**: As you draw, mouse/touch coordinates are captured
2. **Midpoint Calculation**: Control points are calculated as midpoints between captured points
3. **Curve Rendering**: Instead of straight lines, `quadraticCurveTo()` creates smooth curves between points
4. **Stroke Continuity**: Each stroke maintains consistent color and size settings

```javascript
// From smoothPath.js
export function drawSmoothStroke(ctx, points) {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, midX, midY);
  }

  ctx.stroke();
}
```

### State Management

The `useDraw` hook manages:

- **Strokes Array**: Stores all drawing strokes with point data
- **Current Stroke**: Points being added during active drawing
- **History**: Complete undo/redo stack
- **Settings**: Current color and brush size

```javascript
const [strokes, setStrokes] = useState([]);
const [currentStroke, setCurrentStroke] = useState([]);
const [history, setHistory] = useState([]);
const [color, setColor] = useState("#000000");
const [size, setSize] = useState(3);
```

### Event Handling

The canvas handles both mouse and touch events:

| Event | Action |
|-------|--------|
| `mousedown` / `touchstart` | Begin new stroke |
| `mousemove` / `touchmove` | Add points to current stroke |
| `mouseup` / `touchend` / `mouseleave` | Finalize stroke |

Touch events are normalized to match mouse event coordinates:

```javascript
const handleTouchStart = (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  startDrawing({ clientX: touch.clientX, clientY: touch.clientY });
};
```

### SVG Export

The export feature converts stroke data to SVG paths:

1. Iterate through all strokes
2. Convert points to SVG path commands (`M` for move, `Q` for quadratic curves)
3. Wrap in SVG element with proper viewBox
4. Create downloadable blob

### Canvas Resizing

The canvas automatically resizes to fit its container:

1. `ResizeObserver` or `resize` event detects container size changes
2. Canvas dimensions are updated to match
3. All strokes are redrawn at the new scale

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/signature-io.git
cd signature-io
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Build

To create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

## Technologies

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **HTML5 Canvas API** - Drawing surface
- **SVG** - Export format

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13.1+
- Edge 80+
- Mobile Safari (iOS 13+)
- Chrome for Android

## SEO Features

The application includes comprehensive SEO meta tags:

- Open Graph tags for social sharing
- Twitter Cards support
- Responsive viewport settings
- Theme color for mobile browsers
- Canonical URLs
- Structured meta descriptions and keywords

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Icons from [Heroicons](https://heroicons.com/)
- Color picker uses native HTML5 color input
- Font: System font stack for optimal performance
