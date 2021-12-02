import React from "react";
import { AnimatePresence, motion } from "framer-motion";

import css from "styled-jsx/css";

const FadeInFadeOut = ({ children }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: "easeOut", duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default FadeInFadeOut;
