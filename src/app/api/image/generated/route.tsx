import generateImage from "@/app/lib/generateImage";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const score = Number(req.nextUrl.searchParams.get("score")) ?? 0;
  return await generateImage(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        fontSize: 20,
        fontWeight: 600,
      }}
    >
      <h3>
        <b>
          {score >= 50
            ? "Congrats! You are eligible!"
            : "Sorry, you are not eligible, you can mint with wraps"}
        </b>
      </h3>
      <h1>{score}</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Powered By{" "}
        <img
          alt="Airstack Logo"
          height="100px"
          src={`${process.env.NEXT_PUBLIC_HOSTNAME}/logo.png`}
        />
      </div>
    </div>
  );
}

export const runtime = "edge";
