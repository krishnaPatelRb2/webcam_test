import Link from "next/link";
import React, { useRef, useState, useEffect } from "react";
import MyDashboard from "@/components/MyDashboard";
export default function route() {
  return (
    <>
      <MyDashboard></MyDashboard>
      {/* <div className="w-full h-full flex justify-center items-center gap-x-4">
        <Link href="/Realtime" className="px-3 py-1 bg-black text-white">
          Go to Live testing
        </Link>
        <Link href="/local" className="px-3 py-1 bg-black text-white">
          Go to Local testing
        </Link>
      </div> */}
      
    </>
  );
}
