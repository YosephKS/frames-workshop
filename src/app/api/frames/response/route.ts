import fetchOnchainScore from "@/app/lib/airstack/fetchOnchainScore";
import {
  getFrameHtml,
  Frame,
  FrameActionPayload,
  validateFrameMessage,
  FrameButtonsType,
} from "frames.js";
import { NextRequest, NextResponse } from "next/server";

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
      // use `fetchOnchainScore` to get the user's onchain score
      const score = fetchOnchainScore("yosephks.eth", `fc_fid:${fid}`);
      const frame: Frame = {
        version: "vNext",
        image: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/image/generated?score=${score}`,
        // Single Next button post
        buttons: [
          {
            action: "post",
            label: "Next",
          },
        ] as FrameButtonsType,
        ogImage: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/image/generated?score=${score}`,
        postUrl: `${process.env.NEXT_PUBLIC_HOSTNAME}/api/frames/mint`, // to /api/frames/mint
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
      // Redirect to `https://explorer.airstack.xyz/token-balances?address=fc_fname%3Ayosephks.eth%2Cfc_fid%3A${fid}&rawInput=%23%E2%8E%B1fc_fname%3Ayosephks.eth%E2%8E%B1%28fc_fname%3Ayosephks.eth++ethereum+null%29++%23%E2%8E%B1fc_fid%3A${fid}%E2%8E%B1%28fc_fid%3A${fid}++ethereum+null%29&inputType=ADDRESS&activeSnapshotInfo=`
      return NextResponse.redirect(
        `https://explorer.airstack.xyz/token-balances?address=fc_fname%3Ayosephks.eth%2Cfc_fid%3A${fid}&rawInput=%23%E2%8E%B1fc_fname%3Ayosephks.eth%E2%8E%B1%28fc_fname%3Ayosephks.eth++ethereum+null%29++%23%E2%8E%B1fc_fid%3A${fid}%E2%8E%B1%28fc_fid%3A${fid}++ethereum+null%29&inputType=ADDRESS&activeSnapshotInfo=`,
        { status: 302 }
      );
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
