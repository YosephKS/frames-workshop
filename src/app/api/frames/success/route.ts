import {
  getFrameHtml,
  Frame,
  FrameActionPayload,
  validateFrameMessage,
} from "frames.js";
import { NextRequest } from "next/server";

async function getResponse(req: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    const body: FrameActionPayload = await req?.json();
    const { isValid, message } = await validateFrameMessage(body);
    if (!isValid || !message) {
      return new Response("Invalid message", { status: 400 });
    }
  }

  const frame: Frame = {
    version: "vNext",
    image: `https://gateway.ipfs.io/ipfs/Qme9BVhNPfsaKKhPy7k1QWoMnmqrFZMjibXEKjmNEa8ADH/Slice%202.png`,
    ogImage: `https://gateway.ipfs.io/ipfs/Qme9BVhNPfsaKKhPy7k1QWoMnmqrFZMjibXEKjmNEa8ADH/Slice%202.png`,
    postUrl: "",
  };

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
