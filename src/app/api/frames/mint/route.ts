import {
  getFrameHtml,
  Frame,
  FrameActionPayload,
  validateFrameMessage,
  FrameButtonsType,
} from "frames.js";
import { NextRequest } from "next/server";

export interface PurpleDaoFriends {
  profileName: string;
  userId: string;
  profileImageContentValue: {
    image: {
      medium: string;
    };
  };
}

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

  if (score >= 50) {
    // Use the frame message to build the frame
    frame = {
      version: "vNext",
      image: `${process.env.NEXT_PUBLIC_HOSTNAME}/zora.gif`,
      buttons: [
        {
          action: "mint",
          label: "Mint",
          target:
            "eip155:7777777:0xe4ceeb0c8dd38c18692a76562343e089febc30ea:32",
        },
      ] as FrameButtonsType,
      imageAspectRatio: "1:1",
      ogImage: `${process.env.NEXT_PUBLIC_HOSTNAME}/zora.gif`,
      postUrl:
        "https://zora.co/collect/zora:0xa15Bb830aCD9Ab46164e6840E3ef2dBBF9c5E2B3/1",
    };
  } else {
    frame = {
      version: "vNext",
      image: `${process.env.NEXT_PUBLIC_HOSTNAME}/zora.gif`,
      buttons: [
        {
          action: "post",
          label: "Mint for Free",
        },
      ] as FrameButtonsType,
      imageAspectRatio: "1:1",
      ogImage: `${process.env.NEXT_PUBLIC_HOSTNAME}/zora.gif`,
      postUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/success`,
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
