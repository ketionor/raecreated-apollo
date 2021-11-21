import { useAtom } from "jotai";
import { countAtom } from "./Layout";

const Hero = () => {
  const [count, setCount] = useAtom(countAtom);
  return <div></div>;
};

export default Hero;
