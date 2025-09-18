import type * as tf from "@tensorflow/tfjs-core";
import type Webcam from "react-webcam";
import type * as blazeface from "@tensorflow-models/blazeface";

/** Convert landmarks to array safely */
export const getLandmarksArray = (landmarks: number[][] | tf.Tensor2D | undefined): number[][] | null => {
  if (!landmarks) return null;
  if (Array.isArray(landmarks)) return landmarks;
  return (landmarks.arraySync() as number[][]) || null;
};

/** Check if candidate is looking away using landmarks */
export const isLookingAway = (
  pred: blazeface.NormalizedFace,
  webcamRef: React.RefObject<Webcam | null>  // allow null
): boolean => {
  const landmarks = getLandmarksArray(pred.landmarks);
  if (!landmarks || landmarks.length < 3) return true; // critical landmarks missing

  const [rightEye, leftEye, nose, rightEar, leftEar] = landmarks;
  if (!rightEye || !leftEye || !nose) return true;

  const video = webcamRef.current?.video as HTMLVideoElement | undefined;
  if (!video) return true;

  const frameWidth = video.videoWidth;
  const frameHeight = video.videoHeight;

  // Midpoint of eyes
  const eyeCenterX = (rightEye[0] + leftEye[0]) / 2;
  const eyeCenterY = (rightEye[1] + leftEye[1]) / 2;

  // Tolerances (15-20% of frame)
  const tolX = frameWidth * 0.15;
  const tolY = frameHeight * 0.2;

  // Face center check
  const dx = Math.abs(eyeCenterX - frameWidth / 2);
  const dy = Math.abs(eyeCenterY - frameHeight / 2);
  if (dx > tolX || dy > tolY) return true;

  // Head turn: nose relative to eye midpoint
  const noseOffset = nose[0] - eyeCenterX;
  if (Math.abs(noseOffset) > frameWidth * 0.1) return true;

  // Ear visibility: only one ear visible → likely turned
  if ((rightEar && leftEar) || (!rightEar && !leftEar)) return false;
  return true;
};
