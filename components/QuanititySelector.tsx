import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface QuantitySelector {
  quantity: number;
  setQuantity: (number: number) => void;
}

const QuanititySelector = ({ quantity, setQuantity }: QuantitySelector) => {
  const [prevQuantity, setPrevQuantity] = useState(1);

  //true represents quantity is moving up
  const [direction, setDirection] = useState(true);

  const variants = {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
  };

  return (
    <>
      <div className="grid gap-4 grid-cols-3 justify-items-center items-center h-full w-full">
        <svg
          className="flex-1 stroke-current h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="button"
          onClick={() => {
            setDirection(false);
            setTimeout(() => {
              setQuantity(quantity - 1);
            }, 10);
          }}
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>

        <div className="grid grid-cols-1 justify-items-center items-center w-full h-full bg-white rounded shadow-inner">
          <AnimatePresence exitBeforeEnter>
            <motion.p
              variants={variants}
              initial={direction ? "initial" : "exit"}
              animate="animate"
              exit={direction ? "exit" : "initial"}
              transition={{ ease: "easeOut", duration: 0.1 }}
              style={{ color: "black", margin: 0 }}
              key={quantity}
            >
              {quantity}
            </motion.p>
          </AnimatePresence>
        </div>

        <svg
          className="flex-1 stroke-current h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="button"
          onClick={() => {
            setDirection(true);
            setTimeout(() => {
              setQuantity(quantity + 1);
            }, 10);
          }}
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      </div>
    </>
  );
};

export default QuanititySelector;
