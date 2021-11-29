import React from "react";
import Link from "next/link";
import FadeInFadeOut from "../Animations/FadeInFadeOut";
import { useAtom } from "jotai";
import { userAtom } from "../../lib/atoms";
import { motion } from "framer-motion";
import X from "../UI/X";

interface Link {
  name: string;
  to: string;
}

interface ModalTypes {
  links: { name: string; to: string }[];
  toggle: () => void;
}

const containerVariants = {
  hidden: { opacity: 1, y: "-100vh" },
  show: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
    },
  },
  exit: {
    opacity: 0,
    y: "-100vh",
    transition: {
      duration: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6 } },
};

const Modal = ({ links, toggle }: ModalTypes) => {
  const [user, setUser] = useAtom(userAtom);

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="bg-black w-screen h-screen flex justify-center items-center fixed z-10 top-0 left-0"
      >
        <ul>
          <span className="absolute top-6 right-6">
            <X onClick={toggle} />
          </span>
          {links.map(({ name, to }) => {
            //if the first character is a slash it is an internal link
            if (to[0] === "/") {
              return (
                <li onClick={toggle}>
                  <Link href={to} passHref>
                    <a className="text-2xl">{name}</a>
                  </Link>
                </li>
              );
            } else {
              return (
                <li onClick={toggle}>
                  <a href={to}>{name}</a>
                </li>
              );
            }
          })}
          <li>
            {!user.accessToken && (
              <>
                <button className="bg-pink-500 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded mt-4">
                  Log In/Register
                </button>
              </>
            )}
          </li>
        </ul>
      </motion.div>
    </>
  );
};

export default Modal;
