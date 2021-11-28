import { useState, useEffect } from "react";
import Image from "next/image";
import QuanititySelector from "./QuanititySelector";
import { userAtom } from "../lib/atoms";
import { useAtom } from "jotai";
import { useMutation } from "@apollo/client";
import { cartLinesRemoveMutation } from "../lib/shopify";

interface CartItem {
  featuredImage: string;
  title: string;
  itemId: string;
  quantity: number;
  itemQuantityUpdate: ({}) => void;
}

const CartItem = ({
  featuredImage,
  title,
  itemId,
  quantity,
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
      <p className="title">{title}</p>
      <div className="cart-item-container">
        <div className="left-container">
          <span className="image-container">
            <Image
              alt={title}
              height={1}
              width={1}
              src={featuredImage}
              layout="responsive"
            />
          </span>
        </div>
        <div className="right-container">
          <span className="quantity-selector">
            <QuanititySelector
              quantity={thisQuantity}
              setQuantity={setThisQuantity}
            />
          </span>
          {/* trash can */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="trash"
            onClick={handleRemoveItem}
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </div>
      </div>
      <hr />

      <style jsx>{`
        .left-container {
          display: flex;
          align-items: center;
        }

        .right-container {
          display: flex;
          align-items: center;
        }

        .image-container {
          height: 100%;
          width: 5rem;
          margin-right: 1rem;
        }

        .cart-item-container {
          width: 100%;
          height: 5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .quantity-selector {
          height: 30px;
          width: 100px;
          margin-right: 1rem;
        }
      `}</style>
    </>
  );
};

export default CartItem;
