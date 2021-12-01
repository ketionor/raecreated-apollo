import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
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
  slug: string;
  itemQuantityUpdate: ({}) => void;
}

const CartItem = ({
  featuredImage,
  title,
  itemId,
  quantity,
  price,
  slug,
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
      <Link href={`/products/${slug}`} passHref>
        <a className="">{title}</a>
      </Link>
      <div className="mb-4 grid grid-cols-5 sm:grid-cols-9 lg:grid-cols-12 gap-4 justify-items-center items-center">
        <Link href={`/products/${slug}`} passHref>
          <a className="h-full w-full mt-2">
            <Image
              alt={title}
              height={1}
              width={1}
              src={featuredImage}
              layout="responsive"
            />
          </a>
        </Link>
        <span className="col-start-3 sm:col-start-7 lg:col-start-10 col-span-2 flex flex-col justify-between items-center">
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
              className="text-center"
            >{`$${Number(price).toFixed(2)}`}</motion.p>
          </AnimatePresence>
        </span>
        <span className="col-start-5 sm:col-start-9 lg:col-start-12">
          <TrashCan onClick={handleRemoveItem} />
        </span>
      </div>
      <hr />
    </>
  );
};

export default CartItem;
