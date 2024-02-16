import { NFT_IMAGE_URL } from "@/app/constant";
import {
  getFrameHtml,
  Frame,
  FrameActionPayload,
  validateFrameMessage,
  FrameButtonsType,
} from "frames.js";
import { NextRequest } from "next/server";

async function getResponse(req: NextRequest) {
  let fid = 602; // Test FID – Only for development
  const score = Number(req.nextUrl.searchParams.get("score")) ?? 0;
  if (process.env.NODE_ENV === "production") {
    const body: FrameActionPayload = await req?.json();
    const { isValid, message } = await validateFrameMessage(body);
    if (!isValid || !message) {
      return new Response("Invalid message", { status: 400 });
    }
    // Override FID for production from Signature Packet
    fid = message?.data?.fid;
  }

  let frame: Frame;

  if (score < 50) {
    frame = {
      version: "vNext",
      image: NFT_IMAGE_URL,
      // Use sample mint target `eip155:7777777:0xa15Bb830aCD9Ab46164e6840E3ef2dBBF9c5E2B3:1`
      buttons: [
        {
          action: "mint",
          label: "Mint",
          target: "eip155:7777777:0xa15Bb830aCD9Ab46164e6840E3ef2dBBF9c5E2B3:1",
        },
      ] as FrameButtonsType,
      ogImage: NFT_IMAGE_URL,
      postUrl:
        "https://zora.co/collect/zora:0xa15Bb830aCD9Ab46164e6840E3ef2dBBF9c5E2B3/1",
    };
  } else {
    frame = {
      version: "vNext",
      image: NFT_IMAGE_URL,
      // Mint for free POST
      buttons: [
        {
          action: "post",
          label: "Mint for Free",
        },
      ] as FrameButtonsType,
      ogImage: NFT_IMAGE_URL,
      postUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/frames/success`, // to /api/frames/success
    };
  }

  // Return the frame as HTML
  const html = getFrameHtml(frame);

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
    status: 200,
  });
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
