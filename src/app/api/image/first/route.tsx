import generateImage from "@/app/lib/generateImage";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
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
      <h1>
        <b>Check Eligibility and Mint NFTs!</b>
      </h1>
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
