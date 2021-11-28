import { useState, useEffect } from "react";
import Image from "next/image";
import QuanititySelector from "./QuanititySelector";
import { userAtom } from "../lib/atoms";
import { useAtom } from "jotai";
import { useMutation } from "@apollo/client";
import { cartLinesRemoveMutation } from "../lib/shopify";
import TrashCan from "./UI/TrashCan";
import { AnimatePresence, motion } from "framer-motion";

interface CartItem {
  featuredImage: string;
  title: string;
  itemId: string;
  quantity: number;
  price: string;
  itemQuantityUpdate: ({}) => void;
}

const CartItem = ({
  featuredImage,
  title,
  itemId,
  quantity,
  price,
  itemQuantityUpdate,
}: CartItem) => {
  const [thisQuantity, setThisQuantity] = useState<number>(quantity);
  const [user, setUser] = useAtom(userAtom);

  const [removeItem, removeItemData] = useMutation(cartLinesRemoveMutation, {
    variables: {
      cartId: user.cartId,
      lineIds: [itemId],
    },
  });

  const handleRemoveItem = () => {
    removeItem();
  };

  useEffect(() => {
    itemQuantityUpdate({
      variables: {
        cartId: user.cartId,
        lines: {
          id: itemId,
          quantity: thisQuantity,
        },
      },
    });
  }, [thisQuantity, itemId, itemQuantityUpdate, user.cartId]);

  return (
    <>
      <p className="">{title}</p>
      <div className="w-full flex justify-between items-center mb-4 h-12">
        <span className="h-full w-12">
          <Image
            alt={title}
            height={1}
            width={1}
            src={featuredImage}
            layout="responsive"
          />
        </span>
        <div className="flex-initial w-36 flex justify-between items-center">
          <span className=" flex-initial w-24 flex flex-col items-center">
            <QuanititySelector
              quantity={thisQuantity}
              setQuantity={setThisQuantity}
            />
            <AnimatePresence exitBeforeEnter>
              <motion.p
                key={price}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >{`$${Number(price).toFixed(2)}`}</motion.p>
            </AnimatePresence>
          </span>
          <TrashCan onClick={handleRemoveItem} />
        </div>
      </div>
      <hr />
    </>
  );
};

export default CartItem;
