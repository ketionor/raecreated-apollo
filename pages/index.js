import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Hero from "../components/Hero";
import { useAtom, Provider } from "jotai";

export default function Home() {
  return <div className={styles.container}></div>;
}
