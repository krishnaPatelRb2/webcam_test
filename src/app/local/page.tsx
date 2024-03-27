"use client";
import Image from "next/image";
import Link from "next/link";
import MyDashboard from "@/components/MyDashboard";
import React, { useRef, useState, useEffect } from "react";
import cv from "@techstark/opencv-js";
import Tesseract from "tesseract.js";

export default function Child() {
  const [imageSrc, setImageSrc] = useState("");
  const [varlap, setlapVar] = useState(0);
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
  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const src = e.target?.result;
      setImageSrc(src);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
        <div>score - {varlap}</div>
      <input
        title="Upload an image"
        type="file"
        onChange={(e) => {
          handleFileChange(e);
        }}
        accept="image/*"
        className="h-[100px] text-center"
      />
      <div className="w-[300px] h-auto">
        {imageSrc && (
          <img
            src={imageSrc}
            onLoad={(e) => {
              processImage(e.target);
            }}
            alt="Selected"
            className="w-full"
          />
        )}
      </div>
    </div>
  );
}
