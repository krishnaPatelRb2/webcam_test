"use client";
import React, { useRef, useState, useEffect } from "react";

const WebcamBlurChecker: React.FC = () => {
  const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isBlurry, setIsBlurry] = useState<boolean>(false);

  useEffect(() => {
    const video = webcamRef.current;
    const canvas = canvasRef.current;
    let ctx: CanvasRenderingContext2D | null = null;
    let animationFrameId: number;

    const checkBlur = () => {
      if (video && canvas && video.videoWidth && video.videoHeight) {
        ctx = canvas.getContext("2d");

        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw current video frame onto canvas
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Get image data from canvas
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          // Calculate image sharpness (you can replace this with your chosen algorithm)
          const sharpness = calculateSharpness(imageData);

          // Set threshold for blur detection (adjust as needed)
          const blurThreshold = 100;

          // Check if sharpness is below threshold
          setIsBlurry(sharpness < blurThreshold);
        }
      }

      // Schedule next check
      animationFrameId = requestAnimationFrame(checkBlur);
    };

    // Start checking for blur after video metadata is loaded
    const onLoadedMetadata = () => {
      checkBlur();
    };

    if (video) {
      video.addEventListener("loadedmetadata", onLoadedMetadata);
    }

    return () => {
      // Clean up
      setIsBlurry(false); // Reset state
      if (video) {
        video.removeEventListener("loadedmetadata", onLoadedMetadata);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Function to calculate image sharpness (replace with your chosen algorithm)
  const calculateSharpness = (imageData: ImageData): number => {
    // Example: calculate average pixel value difference as a measure of sharpness
    const pixelData = imageData.data;
    let sumDifference = 0;

    for (let i = 0; i < pixelData.length; i += 4) {
      const pixel1 = pixelData[i];
      const pixel2 = pixelData[i + 1];
      const pixel3 = pixelData[i + 2];
      sumDifference +=
        Math.abs(pixel1 - pixel2) +
        Math.abs(pixel2 - pixel3) +
        Math.abs(pixel3 - pixel1);
    }

    const averageDifference = sumDifference / (pixelData.length / 4);
    return averageDifference;
  };

  return (
    <div>
      <video
        ref={webcamRef}
        autoPlay
        muted
        // style={{ display: 'none' }}
      />
      <canvas
        ref={canvasRef}
        // style={{ display: 'none' }}
      />
      {isBlurry ? <p>Webcam is blurry.</p> : <p>Webcam is not blurry.</p>}
    </div>
  );
};

export default WebcamBlurChecker;
