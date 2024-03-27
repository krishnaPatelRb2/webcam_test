"use client";
import Image from "next/image";
import Link from "next/link";
import MyDashboard from "@/components/MyDashboard";
import React, { useRef, useState, useEffect } from "react";
import cv from "@techstark/opencv-js";
import Tesseract from "tesseract.js";

export default function Child() {
  const videoRef = useRef<any>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [snapshot, setSnapshot] = useState<string>("");
  const [lapVar, setlapVar] = useState(0);

  const sendVideoData = (data: string) => {
    //  socket.emit("videoData", data);
  };

  useEffect(() => {
    const enableVideoStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setMediaStream(stream);
      } catch (error) {
        console.error("Error accessing webcam", error);
      }
    };

    enableVideoStream();
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [videoRef, mediaStream]);

  useEffect(() => {
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
        setInterval(() => {
          takeSnapshot();
        }, 500);
      }
    };
  }, [mediaStream]);

  const takeSnapshot = async () => {
    if (mediaStream) {
      // Create a canvas element to capture the snapshot
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current?.videoWidth;
      canvas.height = videoRef.current?.videoHeight;

      // Draw the current frame of the video onto the canvas
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      console.log("ctc", ctx);
      const snapshotData = canvas.toDataURL("image/png");
      setSnapshot(snapshotData);
      const img = cv.imread(canvas);

      // Convert the image to grayscale
      const imgGray = new cv.Mat();
      cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);

      // Calculate the Laplacian
      const laplacian = new cv.Mat();
      cv.Laplacian(imgGray, laplacian, cv.CV_64F);

      console.log("val", laplacian.data);

      const mean = new cv.Mat();
      const stddev = new cv.Mat();
      cv.meanStdDev(laplacian, mean, stddev);

      // Calculate the variance of the Laplacian
      const laplacianVariance = stddev.data64F[0] ** 2;

      // Calculate the variance of the Laplacian
      console.log("testsss", laplacianVariance.toFixed(2));

      // Release Mats to free memory
      img.delete();
      imgGray.delete();
      laplacian.delete();
      mean.delete();
      stddev.delete();
    } else {
      console.error("Media stream is not available.");
    }
  };

  function processImage(imgSrc: any) {
    const img = cv.imread(imgSrc);

    // Convert the image to grayscale
    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);

    // Calculate the Laplacian
    const laplacian = new cv.Mat();
    cv.Laplacian(imgGray, laplacian, cv.CV_64F);

    const mean = new cv.Mat();
    const stddev = new cv.Mat();
    cv.meanStdDev(laplacian, mean, stddev);

    // Calculate the variance of the Laplacian
    const laplacianVariance = stddev.data64F[0] ** 2;
    setlapVar(parseFloat(laplacianVariance.toFixed(2)));
    // Calculate the variance of the Laplacian
    console.log("test img load", laplacianVariance);

    // Release Mats to free memory
    img.delete();
    imgGray.delete();
    laplacian.delete();
    mean.delete();
    stddev.delete();
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <video ref={videoRef} autoPlay={true} className="w-full" />
      <button onClick={takeSnapshot}>Take Snapshot</button>
      <div className="w-[200px] text-center text-lg bg-slate-700 text-white px-3 py-1">
        {lapVar}
      </div>
      {snapshot && (
        <div className="w-full flex flex-col items-center mt-5">
          <h2>Preview</h2>
          <img
            height={200}
            width={200}
            onLoad={(e) => {
              processImage(e.target);
            }}
            src={snapshot}
            alt="Snapshot"
            className="w-2/3 h-auto"
          />
        </div>
      )}
    </div>
  );
}
