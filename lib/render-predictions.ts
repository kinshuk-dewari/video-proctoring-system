// import throttle from "lodash/throttle";

// export interface Prediction {
//   /** [x, y, width, height] */
//   bbox: [number, number, number, number];
//   /** class label from the model (e.g. "person", "book", etc.) */
//   class: string;
//   score?: number;
//   [key: string]: any;
// }

// /**
//  * Renders detection predictions onto a canvas 2D context.
//  */
// export const renderPredictions = (
//   predictions: Prediction[],
//   ctx: CanvasRenderingContext2D
// ): void => {
//   ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//   // Fonts
//   const font = "16px sans-serif";
//   ctx.font = font;
//   ctx.textBaseline = "top";

//   predictions.forEach((prediction) => {
//     const [x, y, width, height] = prediction.bbox;

//     const isPerson = prediction.class === "person";

//     // bounding box
//     ctx.strokeStyle = isPerson ? "#FF0000" : "#00FFFF";
//     ctx.lineWidth = 4;
//     ctx.strokeRect(x, y, width, height);

//     // fill the color (light red overlay for person)
//     ctx.fillStyle = `rgba(255, 0, 0, ${isPerson ? 0.2 : 0})`;
//     ctx.fillRect(x, y, width, height);

//     // Draw the label background.
//     ctx.fillStyle = isPerson ? "#FF0000" : "#00FFFF";
//     const textWidth = ctx.measureText(prediction.class).width;
//     const textHeight = parseInt(font, 10); // base 10
//     ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

//     ctx.fillStyle = "#000000";
//     ctx.fillText(prediction.class, x, y);

//     // if (isPerson) {
//     //   playAudio();
//     // }
//   });
// };


// // const playAudio = throttle(() => {
// //   if (typeof window === "undefined") return; // guard for SSR
// //   try {
// //     const audio = new Audio("/pols-aagyi-pols.mp3");
// //     // audio.play() returns a Promise — explicitly ignore it to avoid unhandled rejections
// //     void audio.play();
// //   } catch (err) {
// //     // swallow errors (e.g. autoplay blocked) or optionally log them
// //     // console.warn('audio play error', err);
// //   }
// // }, 2000);

// export default renderPredictions;
import { createNamedLogger } from "./event-logger";

export interface Prediction {
  /** [x, y, width, height] */
  bbox: [number, number, number, number];
  /** class label from the model (e.g. "person", "book", etc.) */
  class: string;
  score?: number;
  [key: string]: any;
}

// Create a logger instance
const logEvent = createNamedLogger(3000);

// Classes we care about (ignore "person")
const suspiciousItems = ["cell phone", "book", "laptop", "tv", "remote", "mouse", "keyboard"];

/**
 * Renders detection predictions onto a canvas 2D context.
 */
export const renderPredictions = (
  predictions: Prediction[],
  ctx: CanvasRenderingContext2D
): void => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Fonts
  const font = "16px sans-serif";
  ctx.font = font;
  ctx.textBaseline = "top";

  predictions.forEach((prediction) => {
    const [x, y, width, height] = prediction.bbox;
    const label = prediction.class.toLowerCase();

    const isSuspicious = suspiciousItems.includes(label);

    // Only log if it's suspicious (NOT "person")
    if (isSuspicious) {
      logEvent("SuspiciousObject", `${label} Detected`);
    }

    // bounding box
    ctx.strokeStyle = isSuspicious ? "#FF0000" : "#00FFFF";
    ctx.lineWidth = 4;
    ctx.strokeRect(x, y, width, height);

    // fill color (red tint if suspicious)
    ctx.fillStyle = `rgba(255, 0, 0, ${isSuspicious ? 0.2 : 0})`;
    ctx.fillRect(x, y, width, height);

    // Draw label background
    ctx.fillStyle = isSuspicious ? "#FF0000" : "#00FFFF";
    const textWidth = ctx.measureText(prediction.class).width;
    const textHeight = parseInt(font, 10); // base 10
    ctx.fillRect(x, y, textWidth + 4, textHeight + 4);

    // Label text
    ctx.fillStyle = "#000000";
    ctx.fillText(prediction.class, x, y);
  });
};

export default renderPredictions;

