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

  const containerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,

      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -25, y: -25 },
    show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    retrieveCart();
  }, []);

  useEffect(() => {
    setLineItems(data?.cart.lines.edges);
  }, [data]);

  return (
    <div className="max-w-5xl w-full">
      <h1 className="text-3xl mb-4">Cart</h1>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={lineItems?.length > 0 && "show"}
        className="flex flex-col"
      >
        {lineItems?.length > 0 ? (
          lineItems?.map((element, idx) => {
            const itemId = element.node.id;
            const quantity = element.node.quantity;
            const price = element.node.estimatedCost.subtotalAmount.amount;
            const title = element.node.merchandise.product.title;
            const featuredImage =
              element.node.merchandise.product.images.edges[0].node.originalSrc;
            const slug = element.node.merchandise.product.handle;
            return (
              <motion.div key={itemId} variants={itemVariants} className="">
                <CartItem
                  featuredImage={featuredImage}
                  itemId={itemId}
                  quantity={quantity}
                  title={title}
                  price={price}
                  slug={slug}
                  itemQuantityUpdate={itemQuanityUpdate}
                />
              </motion.div>
            );
          })
        ) : (
          <p>Nothing here yet...</p>
        )}
      </motion.div>
      <p className="text-right mt-4">
        {loading
          ? ""
          : `Total: $${Number(
              data?.cart.estimatedCost.subtotalAmount.amount || "$0.00"
            ).toFixed(2)}`}
      </p>
      <a href={data?.cart.checkoutUrl} rel="noopener noreferrer">
        <button className="w-full bg-pink-500 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded mt-4">
          Proceed to checkout
        </button>
      </a>
    </div>
  );
};

export default Cart;
