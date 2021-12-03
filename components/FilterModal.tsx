import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import X from "./UI/X";

const FilterModal = ({ tags, toggleModal }) => {
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

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="bg-black w-screen h-screen flex justify-center items-center fixed z-50 top-0 left-0
            pr-4 pl-4"
      >
        <span className="absolute top-6 right-6">
          <X onClick={toggleModal} />
        </span>
        <div>
          <p className="text-2xl mb-2">Tags</p>
          {tags}
        </div>
      </motion.div>
    </>
  );
};

export default FilterModal;
