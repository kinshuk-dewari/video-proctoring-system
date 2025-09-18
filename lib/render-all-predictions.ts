import type * as blazeface from "@tensorflow-models/blazeface";

export interface ObjectPrediction {
  bbox: [number, number, number, number];
  class: string;
  score?: number;
  [key: string]: any;
}

// Suspicious object classes we care about
const suspiciousItems = [
  "cell phone",
  "book",
  "laptop",
  "tv",
  "remote",
  "mouse",
  "keyboard",
];

// Render both face (focus) predictions + object predictions.
export const renderAllPredictions = (
  faces: blazeface.NormalizedFace[],
  objects: ObjectPrediction[],
  ctx: CanvasRenderingContext2D
) => {
  if (!ctx) return;

  // clear once per frame
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Face / Focus detection
  faces.forEach((pred) => {
    const topLeft = Array.isArray(pred.topLeft)
      ? pred.topLeft
      : (pred.topLeft.arraySync() as [number, number]);
    const bottomRight = Array.isArray(pred.bottomRight)
      ? pred.bottomRight
      : (pred.bottomRight.arraySync() as [number, number]);

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

      landmarks.forEach(([lx, ly]) => {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(lx, ly, 4, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  });


  // Object detection
  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  objects.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;
    const label = prediction.class.toLowerCase();

    const isSuspicious = suspiciousItems.includes(label);

    // bounding box
    ctx.strokeStyle = isSuspicious ? "#FF0000" : "#00FFFF";
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);

    // fill tint
    ctx.fillStyle = `rgba(255, 0, 0, ${isSuspicious ? 0.25 : 0})`;
    ctx.fillRect(x, y, width, height);

    // Draw label background
    ctx.fillStyle = isSuspicious ? "#FF0000" : "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10);
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

    // Label text
    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, x, y);
  });
};
