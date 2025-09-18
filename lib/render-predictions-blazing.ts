import type * as blazeface from "@tensorflow-models/blazeface";

export const renderPredictions = (
  predictions: blazeface.NormalizedFace[],
  ctx: CanvasRenderingContext2D
) => {
  if (!ctx) return;

  // Fade previous frame slightly
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  predictions.forEach(pred => {
    const topLeft = Array.isArray(pred.topLeft) ? pred.topLeft : (pred.topLeft.arraySync() as [number, number]);
    const bottomRight = Array.isArray(pred.bottomRight) ? pred.bottomRight : (pred.bottomRight.arraySync() as [number, number]);
    const [x1, y1] = topLeft;
    const [x2, y2] = bottomRight;
    const width = x2 - x1;
    const height = y2 - y1;

    // Bounding box
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 2;
    ctx.strokeRect(x1, y1, width, height);

    // Landmarks
    if (pred.landmarks) {
      const landmarks = Array.isArray(pred.landmarks)
        ? pred.landmarks
        : (pred.landmarks.arraySync() as number[][]);
      landmarks.forEach(([x, y]) => {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  });
};
