import Image from "next/image";

const Hero = () => {
  return (
    <div className="h-screen relative">
      <div className="p-4 flex flex-col justify-center h-full bg-gradient-to-b from-pink-900 to-black relative z-10 opacity-75">
        <h1 className="text-5xl">raecreatedit</h1>
        <h2 className="text-xl">I make things.</h2>
      </div>
      <Image
        src="https://cdn.shopify.com/s/files/1/0499/7568/9378/files/IMG_1294.jpg?v=1638149442"
        alt=""
        layout="fill"
        objectFit="cover"
        className="relative top-0 h-screen"
      />
    </div>
  );
};

export default Hero;
