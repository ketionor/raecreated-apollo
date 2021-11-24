import React, { useEffect, useState } from "react";
import Image from "next/image";

import { useAtom } from "jotai";
import { cartAtom } from "../lib/atoms";

const Cart = (data) => {
  const [cart, setCart] = useAtom(cartAtom);
  const [cartElements, setCartElements] = useState([]);
  //   console.log("from apollo", data);

  const populatePage = () => {
    const cartItems = cart.lines.edges.map((item, idx) => {
      // const featuredImage =
      //   item.node.merchandise.product.images.edges[0].node.originalSrc;
      const quantity = item.node.quantity;

      //this is a situation where unique keys may be important
      return (
        <span key={idx}>
          <h2>{quantity}</h2>
          {/* <Image height={1} width={1} src={featuredImage} /> */}
        </span>
      );
    });

    return cartItems;
  };

  useEffect(() => {
    setCartElements(populatePage());
  }, []);

  return (
    <div>
      <h1>Items in your cart</h1>
    </div>
  );
};

export default Cart;
