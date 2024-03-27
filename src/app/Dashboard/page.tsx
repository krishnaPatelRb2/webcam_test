"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
// import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import Image from "next/image";
import {
  getObject,
  handleSnapshotDownload,
  initializeBackend,
} from "@/services/functions";

function App() {
  const webcamRef = useRef<Webcam>(null);
  // const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snapshot, setSnapshot] = useState<string>("");
  const [detectedObj, setDetectedObj] = useState<string>("");

  const takeSnapshot = useCallback(() => {
    const imageSrc = (webcamRef.current as any).getScreenshot();
    setSnapshot(imageSrc);
    console.log(getObject(webcamRef));
  }, []);

  // const getObject = async () => {
  //   const video = (webcamRef.current as any).video;
  //   const net = await cocoSsd.load();
  //   const obj = await net.detect(video);
  //   // console.log(obj);
  //   return obj;
  // };

  useEffect(() => {
    // const initializeBackend = async () => {
    //   try {
    //     await tf.setBackend("webgl");
    //   } catch (error) {
    //     console.error("Error initializing WebGL backend:", error);
    //   }
    // };
    const initialize = async () => await initializeBackend();

    const runCoco = async () => {
      const net = await cocoSsd.load();

      // Define detect function here to access net
      const detect = async () => {
        if (
          webcamRef.current &&
          webcamRef.current.video &&
          webcamRef.current.video.readyState === 4
        ) {
          const video = webcamRef.current.video;
          const videoWidth = webcamRef.current.video.videoWidth;
          const videoHeight = webcamRef.current.video.videoHeight;

          webcamRef.current.video.width = videoWidth;
          webcamRef.current.video.height = videoHeight;

          // if (canvasRef.current) {
          //   canvasRef.current.width = videoWidth;
          //   canvasRef.current.height = videoHeight;
          // }

          const obj = await net.detect(video);
          // console.log(obj);
          setDetectedObj(obj[0]?.class);

          // const ctx = (canvasRef.current as any).getContext("2d");
          // drawSomething(obj, ctx);
        }
      };

      // Call detect function in an interval
      const intervalId = setInterval(detect, 10);

      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    };

    initialize();
    runCoco();
  }, []);

  // const drawSomething = (obj: any, ctx: any) => {
  //   obj.forEach((prediction: any) => {
  //     const [x, y, width, height] = prediction["bbox"];
  //     const text = prediction["class"];

  //     const color = "green";
  //     ctx.strokeSylt = color;
  //     ctx.font = "18px Arial";
  //     ctx.fillStyle = color;

  //     ctx.beginPath();
  //     ctx.fillText(text, x, y);
  //     ctx.rect(x, y, width, height);
  //     ctx.stroke();
  //   });
  // };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="w-full h-1/2 flex flex-col relative">
        {
          <Webcam
            ref={webcamRef}
            videoConstraints={{
              facingMode: "environment",
              width: 2160,
              height: 1440,
            }}
            muted={true}
            screenshotQuality={1}
            style={{
              position: "absolute",
              margin: "auto",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              textAlign: "center",
              zIndex: 9,
              width: 640, //typeof window !== "undefined" ? window.innerWidth : 0,
              height: 480, //typeof window !== "undefined" ? window.innerHeight - 100 : 0,
            }}
          />
        }

        {/* <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            margin: "auto",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            textAlign: "center",
            zIndex: 10,
            width: 640,
            height: 480,
          }}
        /> */}
        <p className="w-full h-full absolute top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center text-white text-xl">
          <span>{detectedObj}</span>
        </p>
      </div>
      <div className="h-1/2 text-center">
        <button
          type="button"
          onClick={takeSnapshot}
          className="bg-black text-white rounded-none px-3"
        >
          Take Snapshot
        </button>
        <button
          type="button"
          onClick={() => handleSnapshotDownload(snapshot)}
          disabled={!snapshot}
          className={`bg-black text-white rounded-none px-3 ${
            !snapshot && "opacity-50 cursor-not-allowed"
          }`}
        >
          Download Snapshot
        </button>
        {snapshot && (
          <div className="w-full flex flex-col justify-center items-center">
            <h2>Preview</h2>
            <Image
              src={snapshot}
              width={500}
              height={500}
              alt="Picture of the author"
              className="h-auto"
            />
          </div>
        )}
        {/* <p>{detectedObj}</p> */}
      </div>
    </div>
  );
}

export default App;
