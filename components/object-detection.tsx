"use client";

// import React, { useEffect, useRef, useState } from "react";
// import Webcam from "react-webcam";
// import { load as cocoSSDLoad } from "@tensorflow-models/coco-ssd";
// import * as tf from "@tensorflow/tfjs";
// import { renderPredictions } from "@/lib/render-predictions";

// let detectInterval: ReturnType<typeof setInterval> | null = null;

// const ObjectDetection: React.FC = () => {
//   const [isLoading, setIsLoading] = useState<boolean>(true);

//   const webcamRef = useRef<Webcam | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);

//   async function runCoco() {
//     setIsLoading(true);
//     const net = await cocoSSDLoad();
//     setIsLoading(false);

//     detectInterval = setInterval(() => {
//       runObjectDetection(net)
//     }, 10);
//   }

//   async function runObjectDetection(net:any) {
//     if (
//       canvasRef.current &&
//       webcamRef.current !== null &&
//       webcamRef.current.video?.readyState === 4
//     ) {
//       canvasRef.current.width = webcamRef.current.video.videoWidth;
//       canvasRef.current.height = webcamRef.current.video.videoHeight;

//       // find detected objects
//       const detectedObjects = await net.detect(
//         webcamRef.current.video,
//         undefined,
//         0.6
//       );

//       //   console.log(detectedObjects);

//       const context = canvasRef.current.getContext("2d");
//       if(context) {
//         renderPredictions(detectedObjects, context);
//         }
//     }
//     }

//   const showMyVideo = () => {
//     if (
//       webcamRef.current !== null &&
//       webcamRef.current.video?.readyState === 4
//     ) {
//       const myVideoWidth = webcamRef.current.video.videoWidth;
//       const myVideoHeight = webcamRef.current.video.videoHeight;

//       webcamRef.current.video.width = myVideoWidth;
//       webcamRef.current.video.height = myVideoHeight;
//     }
//   };


//   useEffect(() => {
//     runCoco();
//     showMyVideo();

//     return () => {
//       if (detectInterval) {
//         clearInterval(detectInterval);
//       }
//     };
//   }, []);

//   return (
//     <div className="mt-8">
//       {isLoading ? (
//         <div className="text-white">Loading AI Model...</div>
//       ) : (
//         <div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
//           {/* Webcam */}
//           <Webcam
//             ref={webcamRef}
//             className="rounded-md w-full lg:h-[720px]"
//             muted
//           />
//           {/* Canvas */}
//           <canvas
//             ref={canvasRef}
//             className="absolute top-0 left-0 z-50 w-full lg:h-[720px]"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ObjectDetection;

import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSSDLoad, ObjectDetection as CocoSSDModel } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";
// explicitly register backends
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";

import { renderPredictions } from "@/lib/render-predictions";

let detectInterval: ReturnType<typeof setInterval> | null = null;

const ObjectDetection: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
  }, []);

  return (
    <div className="mt-8">
      {isLoading ? (
        <div className="text-white">Loading AI Model...</div>
      ) : (
        <div className="relative flex justify-center items-center gradient p-1.5 rounded-md">
          <Webcam
            ref={webcamRef}
            className="rounded-md w-full lg:h-[720px]"
            muted
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 z-50 w-full lg:h-[720px]"
          />
        </div>
      )}
    </div>
  );
};

export default ObjectDetection;
