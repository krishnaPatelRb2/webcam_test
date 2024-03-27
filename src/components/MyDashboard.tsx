'use client'
import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import cv from "@techstark/opencv-js";
import loaderIcon from "../app/spinner.gif"
function MyDashboard() {
  const webcamRef = useRef<Webcam>(null);
  const [snapshot, setSnapshot] = useState<string>("");
  const [score, setScore] = useState<number>(0)
  const [loader, setloader] = useState<boolean>(false);


  const takeSnapshot = useCallback(() => {
    const imageSrc = (webcamRef.current as any).getScreenshot();
    setSnapshot(imageSrc);
  }, []);

 

  useEffect(() => {

    const runCoco = async () => {
      

      // Define detect function here to access net
      const detect = async () => {
        if (
          webcamRef.current &&
          webcamRef.current.video &&
          webcamRef.current.video.readyState === 4
        ) {
          
            takeSnapshot()
          
        }
      };

      // Call detect function in an interval
      const intervalId = setInterval(detect, 500);

      // Clean up interval on component unmount
      return () => clearInterval(intervalId);
    };

    // initializeBackend();
    runCoco();
  }, []);

  const checkBlur = async (imgSrc:any) =>{
    const img = cv.imread(imgSrc);

    // Convert the image to grayscale
    const imgGray = new cv.Mat();
    cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);

    // Grab the dimensions of the image
    const { rows: h, cols: w } = imgGray;

    // const fft = cv.FFT.createC2C(h, w);
    // const { dst: fftShift } = fft.forward(imgGray);

    // Derive the center (x, y)-coordinates
    const cX = Math.floor(w / 2.0);
    const cY = Math.floor(h / 2.0);

    // Calculate the Laplacian
    const laplacian = new cv.Mat();
    cv.Laplacian(imgGray, laplacian, cv.CV_64F);

    const mean = new cv.Mat();
    const stddev = new cv.Mat();
    cv.meanStdDev(laplacian, mean, stddev);

    // Calculate the variance of the Laplacian
    const laplacianVariance = stddev.data64F[0] ** 2;
    setScore(parseFloat(laplacianVariance.toFixed(2)))
    // Calculate the variance of the Laplacian
    console.log('test img load',laplacianVariance)

    // Release Mats to free memory
    img.delete();
    imgGray.delete();
    laplacian.delete();
    mean.delete();
    stddev.delete();
   

    }

 const postImage = ()=>{
  setloader(true)
 }

  return (
    <div className=" h-[100%]">
      <div className="">
        {
          <Webcam
            ref={webcamRef}
            videoConstraints={{ facingMode: "environment" }}
            muted={true}
            style={{
              textAlign: "center",
              zIndex: 9,
              height:'500px',
              width:'100%'
            }}
          />
        }

        
      </div>
      <div className="h-1/2">
        {snapshot && (
          <div className="w-full flex flex-col justify-center items-center">
            <h2>laplacian Variance- {score}</h2>
            {!loader && (<button className="text-[40px] px-3 py-1 bg-[green] rounded-[10px] text-white " onClick={postImage}>Post</button>)}
            { loader && (<Image
              src={loaderIcon}
              width={50}
              height={50}
              alt="Picture of the author"
              className="h-auto"
              
            />)} 
            <Image
              style={{display:'none'}}
              src={snapshot}
              width={300}
              height={300}
              alt="Picture of the author"
              className="h-auto"
              onLoad={(e)=>{
                checkBlur(e.target)
              }}
            />
          </div>
        )}
        
      </div>
    </div>
  );
}

export default MyDashboard; 