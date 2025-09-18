"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as blazeface from "@tensorflow-models/blazeface";
import { LoaderOne } from "../ui/loader";
import { Button1 } from "../ui/Button";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";

import { isLookingAway } from "@/lib/proctoring-utils";
import { renderPredictions } from "@/lib/render-predictions-blazing";
import { createNamedLogger } from "@/lib/event-logger";

let focusInterval: ReturnType<typeof setInterval> | null = null;

// Create a logger instance
const logEvent = createNamedLogger(3000);

const Proctoring: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);

  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modelRef = useRef<blazeface.BlazeFaceModel | null>(null);
  const lastFocusTime = useRef<number>(Date.now());

  /** Load BlazeFace model */
  const loadModel = async () => {
    setIsLoading(true);
    modelRef.current = await blazeface.load();
    setIsLoading(false);
  };

  /** Main detection loop */
  const runProctoring = async () => {
    if (!webcamRef.current?.video || webcamRef.current.video.readyState !== 4 || !canvasRef.current || !modelRef.current) return;

    const video = webcamRef.current.video as HTMLVideoElement;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;

    const predictions = await modelRef.current.estimateFaces(video, false);

    if (isCanvasVisible) renderPredictions(predictions, ctx);

    // Event logging
    const now = Date.now();
    if (predictions.length === 0 && now - lastFocusTime.current > 10000) {
      logEvent("FocusDetection","No face detected > 10s");

      lastFocusTime.current = now;
    }

    if (predictions.length > 1) logEvent("FocusDetection","Multiple faces detected"); 

    if (predictions.length > 0) {
      const away = isLookingAway(predictions[0], webcamRef);
      if (away && now - lastFocusTime.current > 5000) {
        logEvent("FocusDetection","Candidate looking away > 5s");
        lastFocusTime.current = now;
      } else if (!away) {
        lastFocusTime.current = now;
      }
    }
  };

  useEffect(() => {
    loadModel().then(() => {
      focusInterval = setInterval(runProctoring, 500);
    });
    return () => { if (focusInterval) clearInterval(focusInterval); };
  }, [isCanvasVisible]);

  const handleToggle = () => setIsCanvasVisible(prev => !prev);

  return (
    <div className="mt-8 w-full max-w-7xl mx-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <LoaderOne />
          <p className="text-[#808080]">Loading BlazeFace Model</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-7xl">
          <div className="relative rounded-md">
            <Webcam ref={webcamRef} className="rounded-md w-full lg:h-[480px]" muted />
            {isCanvasVisible && (
              <canvas ref={canvasRef} className="absolute top-0 left-0 z-50 w-full lg:h-[480px]" />
            )}
          </div>
          <Button1 onClick={handleToggle}>Show Proctoring Overlay</Button1>
        </div>
      )}
    </div>
  );
};

export default Proctoring;
