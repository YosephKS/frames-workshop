import { Frame, getFrameFlattened } from "frames.js";
import type { Metadata } from "next";

// Declare the frame
const initialFrame: Frame = {
  image: INTIAL_IMAGE,
  version: "vNext",
  buttons: [
    {
      action: "post",
      label: "Random image",
    },
    {
      action: "post_redirect",
      label: "",
    },
    {
      action: "link",
      label: "Powered By Airstack",
      target: "https://airstack.xyz",
    },
  ],
  postUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}/frames`,
};

// Export Next.js metadata
export const metadata: Metadata = {
  title: "Frames Airstack Demo",
  description: "This is a demo of building Frames with Airstack.",
  openGraph: {
    images: [
      {
        url: INTIAL_IMAGE,
      },
    ],
  },
  other: getFrameFlattened(initialFrame),
};

export default function Home() {
  return <>Frames Airstack Starter</>;
}
