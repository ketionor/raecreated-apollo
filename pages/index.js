import Head from "next/head";
import Image from "next/image";
import Hero from "../components/Hero";
import { useAtom, Provider } from "jotai";

export default function Home() {
  return (
    <div className="">
      <Hero />
    </div>
  );
}
