import * as tf from "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

export const getObject = async (webcamRef: any) => {
  const video = (webcamRef.current as any).video;
  const net = await cocoSsd.load();
  const obj = await net.detect(video);
  // console.log(obj);
  return obj;
};

export const initializeBackend = async () => {
  try {
    await tf.setBackend("webgl");
  } catch (error) {
    console.error("Error initializing WebGL backend:", error);
  }
};

export const handleSnapshotDownload = (snapshot: string) => {
  const link = document.createElement("a");
  link.href = snapshot;
  link.download = "snapshot.jpg";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
