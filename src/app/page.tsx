import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";

export default function route() {
  return (
    <>
      {/* <div>This is main UI</div> */}
      <div className="w-full h-full flex justify-center items-center gap-x-4">
        {/* <Link href="/Dashboard" className="px-3 py-1 bg-black text-white">
          Go to Dashboard
        </Link>
        <Link href="/webcam-opencv" className="px-3 py-1 bg-black text-white">
          Go to Webcam OpenCV
        </Link> */}
        <Link href="/Realtime" className="px-3 py-1 bg-black text-white">
          Go to Live testing
        </Link>
        <Link href="/local" className="px-3 py-1 bg-black text-white">
          Go to Local testing
        </Link>
      </div>
    </>
  );
}
