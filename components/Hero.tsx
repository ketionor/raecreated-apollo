import Image from "next/image";
import { useState, useEffect } from "react";

const Hero = () => {
  const [bgImg, setBgImg] = useState<string>();

  useEffect(() => {
    const img =
      window.innerWidth > 800
        ? "https://cdn.shopify.com/s/files/1/0499/7568/9378/files/IMG_1294-2.jpg?v=1638371550"
        : "https://cdn.shopify.com/s/files/1/0499/7568/9378/files/IMG_1294.jpg?v=1638149442";
    setBgImg(img);
  }, []);

  return (
    <>
      <div
        className="h-screen relative w-screen flex flex-col justify-center items-center 
        p-4 bg-gradient-to-b from-pink-900 to-black z-10 opacity-90"
      >
        <div className="h-screen w-full max-w-5xl grid grid-cols-12 items-center">
          <h1 className="text-6xl col-start-1 col-span-8 row-start-1 self-end">
            Thread and Scissor Hands
          </h1>
          <h2 className="text-3xl col-start-1  col-span-6 row-start-2 self-baseline">
            I make all the things.
          </h2>
        </div>
      </div>
      <Image
        src={bgImg ? bgImg : "/"}
        alt=""
        layout="fill"
        objectFit="cover"
        className="relative top-0 h-screen"
      />
    </>
  );
};

export default Hero;
