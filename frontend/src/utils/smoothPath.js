export function drawSmoothStroke(ctx, points) {
  if (points.length < 2) return;

  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;

    ctx.quadraticCurveTo(
      points[i].x,
      points[i].y,
      midX,
      midY
    );
  }

  // last segment
  const last = points[points.length - 1];
  ctx.lineTo(last.x, last.y);

  ctx.stroke();
}