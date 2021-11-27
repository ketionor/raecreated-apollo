import { useState, useEffect } from "react";
import Image from "next/image";
import QuanititySelector from "./QuanititySelector";
import { userAtom } from "../lib/atoms";
import { useAtom } from "jotai";

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

  const handleUpdateQuantity = () => {};

  const removeItem = () => {};

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
      <div className="cart-item-container">
        <div className="left-container">
          <div className="image-container">
            <Image
              alt={title}
              height={1}
              width={1}
              src={featuredImage}
              layout="responsive"
            />
          </div>
          <p className="title">{title}</p>
        </div>
        <div className="right-container">
          <QuanititySelector
            quantity={thisQuantity}
            setQuantity={setThisQuantity}
          />
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
          >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </div>
      </div>

      <style jsx>{`
        .left-container {
          display: flex;
        }

        .right-container {
          display: flex;
        }

        .image-container {
          width: 50px;
          height: 50px;
        }

        .cart-item-container {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </>
  );
};

export default CartItem;
