import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import css from "styled-jsx/css";

const { className, styles } = css.resolve`
  div {
    /* THIS CSS IS SPECIFICALLY FOR THE MOBILE NAV MODAL!!!! */
    align-self: stretch;
    display: flex;
    flex-direction: column;
    /* variables */
    --overlay-color: black;
    --font-color: white;
    --x-button-color: var(--font-color);
    --x-button-size: 36px;
    /* Height & width depends on how you want to reveal the overlay */
    height: 100vh;
    width: 100vw;
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    background-color: rgb(0, 0, 0); /* Black fallback color */
    background-color: rgba(0, 0, 0, 0.9); /* Black w/opacity */
    overflow-x: hidden; /* Disable horizontal scroll */
    transition: 0.5s; /* 0.5 second transition effect to slide in or slide down the overlay (height or width, depending on reveal) */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  @media only screen and (min-width: 768px) {
    div {
    }
  }
`;

const FadeInFadeOut = ({ children }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.3 } }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        transition={{ ease: "easeOut" }}
        className={className}
      >
        {children}
      </motion.div>
      {styles}
    </>
  );
};

export default FadeInFadeOut;
