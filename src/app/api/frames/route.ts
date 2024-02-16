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
      const score = await fetchOnchainScore("yosephks.eth", `fc_fid:${fid}`);

      // Use the frame message to build the frame
      const frame: Frame = {
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
      const { data } = await fetch(
        `${process.env.NEXT_PUBLIC_HOSTNAME}/api/purple-dao/airstack/farcaster-details?fid=${fid}`
      ).then((res) => res?.json());
      const { profileName, followingCount, followerCount } =
        data?.Socials?.Social?.[0] ?? {};
      return NextResponse.redirect(
        `https://explorer.airstack.xyz/token-balances?address=fc_fid%3A${fid}&rawInput=%23%E2%8E%B1fc_fid%3A${fid}%E2%8E%B1%28fc_fid%3A${fid}++ethereum+null%29&inputType=&tokenType=&activeView=&activeTokenInfo=&activeSnapshotInfo=&tokenFilters=&activeViewToken=&activeViewCount=&blockchainType=&sortOrder=&spamFilter=&mintFilter=&resolve6551=&activeSocialInfo=farcaster%E2%94%82${profileName}%E2%94%82${fid}%E2%94%820%E2%94%82${followerCount}%E2%94%82%E2%94%82%E2%94%82${followingCount}%E2%94%82%E2%94%82%23%E2%8E%B10xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60%E2%8E%B1%280xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60+ADDRESS+ethereum+null%29`,
        { status: 302 }
      );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
