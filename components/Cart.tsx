import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useLazyQuery, useMutation } from "@apollo/client";
import { retrieveCartQuery, cartLinesUpdateMutation } from "../lib/shopify";
import { useAtom } from "jotai";
import { userAtom } from "../lib/atoms";
import CartItem from "./CartItem";
import { motion } from "framer-motion";
import FadeInFadeOut from "./Animations/FadeInFadeOut";

const Cart = () => {
  const [cartElements, setCartElements] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [user, setUser] = useAtom(userAtom);

  const [retrieveCart, { loading, error, data }] = useLazyQuery(
    retrieveCartQuery,
    {
      variables: {
        id: user.cartId,
      },
    }
  );

  const [itemQuanityUpdate, itemQuantityUpdateData] = useMutation(
    cartLinesUpdateMutation
  );

  const log = () => {
    console.log(data);
  };

  const containerVariants = {
    hidden: { opacity: 1, x: 500 },
    show: {
      opacity: 1,
      x: 0,

      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.6 } },
  };

  useEffect(() => {
    retrieveCart();
  }, []);

  useEffect(() => {
    setLineItems(data?.cart.lines.edges);
  }, [data]);

  return (
    <>
      <h1 className="text-3xl">Cart</h1>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={lineItems?.length > 0 && "show"}
      >
        {lineItems?.map((element, idx) => {
          const itemId = element.node.id;
          const quantity = element.node.quantity;
          const price = element.node.estimatedCost.subtotalAmount.amount;
          const title = element.node.merchandise.product.title;
          const featuredImage =
            element.node.merchandise.product.images.edges[0].node.originalSrc;
          return (
            <motion.span key={itemId} variants={itemVariants}>
              <>
                <CartItem
                  featuredImage={featuredImage}
                  itemId={itemId}
                  quantity={quantity}
                  title={title}
                  price={price}
                  itemQuantityUpdate={itemQuanityUpdate}
                />
              </>
            </motion.span>
          );
        })}
      </motion.span>
      <a href={user.checkoutUrl} rel="noopener noreferrer">
        <button
          onClick={log}
          className="w-full bg-pink-500 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Proceed to checkout
        </button>
      </a>
    </>
  );
};

export default Cart;
