import React from "react";
import { motion } from "framer-motion";

const FilterModal = ({ tags }) => {
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

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        exit="exit"
        className="bg-black w-screen h-screen flex justify-center items-center fixed z-50 top-0 left-0"
      >
        <ul>
          <span className="absolute top-6 right-6">
            {/* <X onClick={toggle} /> */}
          </span>

          <li>{tags}</li>
        </ul>
      </motion.div>
    </>
  );
};

export default FilterModal;
