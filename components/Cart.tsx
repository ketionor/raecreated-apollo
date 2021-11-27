import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useLazyQuery, useMutation } from "@apollo/client";
import { retrieveCartQuery, cartLinesUpdateMutation } from "../lib/shopify";
import { useAtom } from "jotai";
import { userAtom } from "../lib/atoms";
import CartItem from "./CartItem";

const Cart = () => {
  const [cartElements, setCartElements] = useState([]);
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

  useEffect(() => {
    retrieveCart();
  }, []);

  return (
    <>
      <h1>Items in your cart</h1>
      {data?.cart.lines.edges.map((element, idx) => {
        const itemId = element.node.id;
        const quantity = element.node.quantity;
        const title = element.node.merchandise.product.title;
        const featuredImage =
          element.node.merchandise.product.images.edges[0].node.originalSrc;
        return (
          <CartItem
            key={itemId}
            featuredImage={featuredImage}
            itemId={itemId}
            quantity={quantity}
            title={title}
            itemQuantityUpdate={itemQuanityUpdate}
          />
        );
      })}
      <button onClick={log}>l;kj</button>

      <style jsx>{`
        .product-image {
          width: 100%;
        }
      `}</style>
    </>
  );
};

export default Cart;
