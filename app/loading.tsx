import React from "react";
import { LoaderOne } from "@/components/ui/loader";

export default function Loading() {
  return <div className="w-full h-screen max-w-7xl flex items-center justify-center mx-auto">
    <LoaderOne />
  </div>   ;
}
