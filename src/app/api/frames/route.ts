import {
  getFrameHtml,
  Frame,
  FrameActionPayload,
  validateFrameMessage,
  FrameButtonsType,
} from "frames.js";
import fetchOnchainScore from "@/app/lib/airstack/fetchOnchainScore";
import { NextRequest, NextResponse } from "next/server";

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
  let buttonIndex = 1;
  if (process.env.NODE_ENV === "production") {
    const body: FrameActionPayload = await req?.json();
    const { isValid, message } = await validateFrameMessage(body);
    if (!isValid || !message) {
      return new Response("Invalid message", { status: 400 });
    }
    // Override FID for production from Signature Packet
    fid = message?.data?.fid;
    buttonIndex = message?.data?.frameActionBody?.buttonIndex;
  }

  switch (buttonIndex) {
    case 1:
      const score =
        (await fetchOnchainScore("yosephks.eth", `fc_fid:${fid}`)) ?? 0;
      let frame: Frame;

      if (score >= 50) {
        // Use the frame message to build the frame
        frame = {
          version: "vNext",
          image: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/image/first?score=${score}`,
          buttons: [
            {
              action: "mint",
              label: "Mint",
              target:
                "eip155:7777777:0xe4ceeb0c8dd38c18692a76562343e089febc30ea:32",
            },
          ] as FrameButtonsType,
          ogImage: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/image/first?score=${score}`,
          postUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/frame`,
        };
      } else {
        frame = {
          version: "vNext",
          image: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/image/first?score=${score}`,
          buttons: [
            {
              action: "post",
              label: "Next",
            },
          ] as FrameButtonsType,
          ogImage: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/image/first?score=${score}`,
          postUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/purple-dao/main`,
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
    case 2:
    default:
      // Fetch data from Airstack of the user's Farcaster Details
      return NextResponse.redirect(`https://airstack.xyz`, { status: 302 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
