"use client";

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad, ObjectDetection as CocoSSDModel } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

// explicitly register backends
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

import { renderPredictions } from "@/lib/render-predictions";
import { LoaderOne } from "../ui/loader";
import { Button1 } from "../ui/Button";

let detectInterval: ReturnType<typeof setInterval> | null = null;
 
const ObjectDetection: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCanvasVisible, setIsCanvasVisible] = useState(false);

  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  async function runCoco() {
    setIsLoading(true);

    // // ensure tf backend is ready
    // if (tf.getBackend() !== "webgl") {
    //   try {
    //     await tf.setBackend("webgl");
    //   } catch {
    //     await tf.setBackend("cpu");
    //   }
    // }
    // await tf.ready();

    // load coco-ssd model
    const net: CocoSSDModel = await cocoSSDLoad();
    setIsLoading(false);

    detectInterval = setInterval(() => {
      runObjectDetection(net).catch(console.error);
    }, 100);
  }

  async function runObjectDetection(net: CocoSSDModel) {
    if (
      canvasRef.current &&
      webcamRef.current?.video &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video as HTMLVideoElement;

      canvasRef.current.width = video.videoWidth;
      canvasRef.current.height = video.videoHeight;

      // detect objects
      const detectedObjects = await net.detect(video, undefined, 0.6);

      const context = canvasRef.current.getContext("2d");
      if (context) {
        renderPredictions(detectedObjects, context);
      }
    }
  }

  const showMyVideo = () => {
    if (webcamRef.current?.video && webcamRef.current.video.readyState === 4) {
      const video = webcamRef.current.video as HTMLVideoElement;
      video.width = video.videoWidth;
      video.height = video.videoHeight;
    }
  };

  useEffect(() => {
    runCoco();
    showMyVideo();

    return () => {
      if (detectInterval) {
        clearInterval(detectInterval);
      }
    };
  }, [isCanvasVisible]);

  // This function is for the button's onClick event
  const handleToggle = () => {
    setIsCanvasVisible(prev => !prev);
  };

  return (
    <div className="mt-8 w-full max-w-7xl mx-auto">
      {isLoading ? (
        <div className="flex items-center flex-col space-y-4 justify-center">
          <LoaderOne />
          <p className="text-[#808080]">Loading coco-ssd Model</p>
        </div>
      ) : (
        <div className="w-full flex justify-center items-center flex-col space-y-4 max-w-7xl mx-auto">
          <div className="relative rounded-md">
            <Webcam
              ref={webcamRef}
              className="rounded-md w-full lg:h-[480px]"
              muted
              // mirrored
              />          
            {/* Conditionally render the canvas */}
            {isCanvasVisible && (
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 z-50 w-full lg:h-[480px]"
              />
            )}
          </div>
          <Button1 onClick={handleToggle}>Show AI Detection</Button1>
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
