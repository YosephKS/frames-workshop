import { Frame, getFrameFlattened } from "frames.js";
import type { Metadata } from "next";
import { INITIAL_IMAGE } from "./constant";

// Declare the frame
const initialFrame: Frame = {
  image: INITIAL_IMAGE,
  version: "vNext",
  buttons: [],
  postUrl: "", // to /api/frames/response
};

// Export Next.js metadata
export const metadata: Metadata = {
  title: "Frames Airstack Demo",
  description: "This is a demo of building Frames with Airstack.",
  openGraph: {
    images: [
      {
        url: INITIAL_IMAGE,
      },
    ],
  },
  other: getFrameFlattened(initialFrame),
};

export default function Home() {
  return <>Frames Airstack Starter</>;
}
