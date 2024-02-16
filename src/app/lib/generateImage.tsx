import { ImageResponse } from "next/og";
import { ReactElement } from "react";

const generateImage = async (jsx: ReactElement) => {
  const robotoMono400 = fetch(
    new URL(
      "../../../node_modules/@fontsource/roboto-mono/files/roboto-mono-latin-400-normal.woff",
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(jsx, {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Roboto_Mono_400", data: await robotoMono400, weight: 400 },
    ],
  });
};

export default generateImage;
