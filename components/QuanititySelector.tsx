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
        <div className="button-container">
          <button
            className="increment-button increment-button-left"
            onClick={() => {
              setDirection(false);
              setTimeout(() => {
                setQuantity(quantity - 1);
              }, 10);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="plus-minus"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
        <div className="number">
          <AnimatePresence exitBeforeEnter>
            <motion.p
              variants={variants}
              initial={direction ? "initial" : "exit"}
              animate="animate"
              exit={direction ? "exit" : "initial"}
              transition={{ ease: "easeOut", duration: 0.1 }}
              style={{ color: "black" }}
              key={quantity}
            >
              {quantity}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="button-container">
          <button
            className="increment-button increment-button-right"
            onClick={() => {
              setDirection(true);
              setTimeout(() => {
                setQuantity(quantity + 1);
              }, 10);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="plus-minus"
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>

      <style jsx>
        {`
          .incrementer-container {
            display: flex;
            justify-content: space-between;
            height: 30px;
            width: 70px;
            border-radius: 5px;

            margin: 0.25rem;
          }

          .button-container {
            padding-top: 1px;
            padding-bottom: 1px;
          }

          .plus-minus {
            stroke: white;
          }

          .increment-button {
            background-color: black;
            border: none;
            width: 20px;
            height: 100%;
            width: 100%;
            padding: 0;
          }

          .increment-button:hover {
            cursor: pointer;
          }

          .number {
            width: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            background-color: white;
          }

          .number p {
            margin: 0;
            color: black;
          }
        `}
      </style>
    </>
  );
};

export default QuanititySelector;
