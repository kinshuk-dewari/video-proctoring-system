"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as blazeface from "@tensorflow-models/blazeface";
import { load as cocoSSDLoad, ObjectDetection as CocoSSDModel } from "@tensorflow-models/coco-ssd";

import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";

import { LoaderOne } from "../ui/loader";
import { Button1 } from "../ui/Button";

import { renderAllPredictions } from "@/lib/render-all-predictions";
import { isLookingAway } from "@/lib/proctoring-utils";
import { createNamedLogger } from "@/lib/event-logger";

let detectionInterval: ReturnType<typeof setInterval> | null = null;

// Shared throttled logger
const logEvent = createNamedLogger(3000);

interface FinalProctoringProps {
  sessionId: string;
  candidateName: string;
}

const FinalProctoringOG: React.FC<FinalProctoringProps> = ({ sessionId, candidateName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);

  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const faceModelRef = useRef<blazeface.BlazeFaceModel | null>(null);
  const objectModelRef = useRef<CocoSSDModel | null>(null);

  const lastFocusTime = useRef<number>(Date.now());

  // Loading both models
  const loadModels = async () => {
    setIsLoading(true);
    [faceModelRef.current, objectModelRef.current] = await Promise.all([
      blazeface.load(),
      cocoSSDLoad()
    ]);
    setIsLoading(false);
  };

  // Focus and Object Detection
  const runDetection = useCallback(async () => {
    if (!webcamRef.current?.video || webcamRef.current.video.readyState !== 4 || !canvasRef.current) return;

    const video = webcamRef.current.video as HTMLVideoElement;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    if (faceModelRef.current && objectModelRef.current) {
      const [faces, objects] = await Promise.all([
        faceModelRef.current.estimateFaces(video, false),
        objectModelRef.current.detect(video, undefined, 0.6),
      ]);

      // overlay for both detections
      //@ts-expect-error: objects type from coco-ssd may not match ObjectPrediction interface
      if (isCanvasVisible) renderAllPredictions(faces, objects, ctx);

      // Focus Events 
      const now = Date.now();

      if (faces.length === 0 && now - lastFocusTime.current > 10000) {
        logEvent("FocusDetection", "No face detected > 10s", sessionId, candidateName);
        lastFocusTime.current = now;
      }

      if (faces.length > 1) logEvent("FocusDetection", "Multiple faces detected", sessionId, candidateName);
      if (faces.length > 0 && webcamRef.current?.video) {
        const away = isLookingAway(faces[0], webcamRef);
        if (away && now - lastFocusTime.current > 5000) {
          logEvent("FocusDetection", "Candidate looking away > 5s", sessionId, candidateName);
          lastFocusTime.current = now;
        } else if (!away) {
          lastFocusTime.current = now;
        }
      }

      // Object Events 
      objects.forEach((obj: { bbox: number[]; class: string; score: number }) => {
        if (["cell phone", "book", "laptop", "mouse", "remote", "keyboard"].includes(obj.class)) {
          logEvent("ObjectDetection", `${obj.class} detected`, sessionId, candidateName);
        }
      });

    }
  },[isCanvasVisible, candidateName, sessionId]);

  useEffect(() => {
    loadModels().then(() => {
      detectionInterval = setInterval(runDetection, 500);
    });
    return () => { if (detectionInterval) clearInterval(detectionInterval); };
  }, [isCanvasVisible,runDetection]);

  return (
    <div className="mt-8 w-full max-w-7xl mx-auto">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <LoaderOne />
          <p className="text-[#808080]">Loading Models...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-7xl">
          <div className="flex text-xl text-[#808080] items-center justify-between gap-8">
            <p>Session Id : {sessionId}</p>
            <p>Candidate : {candidateName}</p>
          </div>
          <div className="relative rounded-md">
            <Webcam ref={webcamRef} className="rounded-md w-full lg:h-[480px]" muted />
            {isCanvasVisible && (
              <canvas ref={canvasRef} className="absolute top-0 left-0 z-50 w-full lg:h-[480px]" />
            )}
          </div>
          <Button1 onClick={() => setIsCanvasVisible(prev => !prev)}>
            {isCanvasVisible ? "Stop Detection" : "Start Detection"}
          </Button1>
        </div>
      )}
    </div>
  );
};

export default FinalProctoringOG;
