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
      <div className="incrementer-container">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="plus-minus"
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

        <div className="number">
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
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="plus-minus"
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

      <style jsx>
        {`
          .incrementer-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            width: 100%;
            border-radius: 5px;
          }

          .plus-minus {
            flex: 1;
            stroke: white;
          }

          .increment-button {
            background-color: black;
            border: none;
            padding: 0;
          }

          .increment-button:hover {
            cursor: pointer;
          }

          .number {
            flex: 1;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            background-color: white;
            box-shadow: inset 1px 1px 5px rgb(45, 45, 45),
              inset -5px -5px 10px white;
          }
        `}
      </style>
    </>
  );
};

export default QuanititySelector;
