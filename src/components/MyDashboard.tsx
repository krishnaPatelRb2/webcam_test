'use client'
import React, { useRef, useState, useEffect, useCallback } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import cv from "@techstark/opencv-js";
import loaderIcon from "../app/spinner.gif"
import cemeraIcon from "../app/focus.png"
import retakeIcon from '../app/turn-up.png'
import arrowIcon from '../app/arrow.png'
function MyDashboard() {
  const webcamRef = useRef<Webcam>(null);
  const [snapshot, setSnapshot] = useState<string>("");
  const [score, setScore] = useState<number>(0)
  const [loader, setloader] = useState<boolean>(false);
  const [clicked, setClicked] = useState<boolean>(false);
  const [resultScreen, setresultScreen] = useState<boolean>(false);


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

 const clickImage = ()=>{
  // setloader(true)
  takeSnapshot()
  setClicked(true)
 }

 const postImage = ()=>{
  setresultScreen(true)
 }

 const retakeImage = () => {
  setClicked(false)
  setresultScreen(false)
 }

  return (
    <div className="h-[100dvh]">
      {!clicked && (
        <div className="">
        
        <Webcam
          ref={webcamRef}
          videoConstraints={{ facingMode: "environment" }}
          muted={true}
          style={{
            textAlign: "center",
            zIndex: 9,
            height:'100dvh',
            width:'100dvw',
            objectFit:'cover'
          }}
        />
        {/* {!loader && (<button style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -110%)',
        }} className="text-[30px] px-3 py-1 bg-[green] rounded-[10px] text-white " onClick={postImage}>Post</button>)} */}
        

      
    </div>
      )}
      
      <div className="">
        {snapshot && clicked && !resultScreen && (
          <div className="w-full flex flex-row justify-between">
            {/* <h2>laplacian Variance- {score}</h2> */}
            
            { false && (<Image
              src={loaderIcon}
              width={50}
              height={50}
              alt="Picture of the author"
              className="h-auto"
              
            />)} 
            <Image
              src={snapshot}
              width={100}
              height={100}
              alt="Picture of the author"
              className="h-auto"
              onLoad={(e)=>{
                checkBlur(e.target)
              }}
              style={{
                textAlign: "center",
                height:'100dvh',
                width:'100dvw',
                objectFit:'cover'
              }}
            />
            {/* <div className="mt-[40px]">
              <div>
              <button className="text-[20px] px-3 py-1 bg-[green] rounded-[5px] text-white ">Retake</button>
              </div>
              <div>
              <button className="text-[20px] px-3 py-1 bg-[green] rounded-[5px] text-white ">Send</button>
              </div>
            </div> */}
          </div>
          
        )}
        
      </div>
     { !resultScreen && (
      <div>
      {!clicked && <Image
             onClick={clickImage}
             src={cemeraIcon}
             width={50}
             height={50}
             alt="Picture of the author"
             className="h-auto"
             style={{
               position: 'fixed',
               left: '50%',
               transform: 'translate(-50%, -120%)',
             }}
           />}
           {clicked && <Image
             onClick={retakeImage}
             src={retakeIcon}
             width={50}
             height={50}
             alt="Picture of the author"
             className="h-auto"
             style={{
               position: 'fixed',
               left: '0',
               transform: 'translate(8%, -120%)',
             }}
           />}
           {clicked && <Image
             onClick={postImage}
             src={arrowIcon}
             width={50}
             height={50}
             alt="Picture of the author"
             className="h-auto"
             style={{
               position: 'fixed',
               right: '0',
               transform: 'translate(-8%, -120%)',
             }}
           />}
      </div>
     )}
     {resultScreen && 
     (
       <div>
        <button onClick={retakeImage}>Back</button>
        <div>Extracted text</div>
       </div>
     )}
    </div>
  );
}

export default MyDashboard; 