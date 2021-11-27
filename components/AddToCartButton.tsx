import { useAtom } from "jotai";
import { userAtom } from "../lib/atoms";
import { motion } from "framer-motion";
import client from "../lib/apollo";
import { useMutation } from "@apollo/client";
import {
  createCartMutation,
  getProductByHandle,
  addNewLineItemMutation,
  retrieveCartQuery,
  cartLinesUpdateMutation,
  getCollectionByHandleQuery,
} from "../lib/shopify";

interface AddToCartButton {
  id: string;
  quantity: number;
  type: "icon" | "text";
}

const AddToCartButton = ({ id, quantity, type }: AddToCartButton) => {
  const [user, setUser] = useAtom(userAtom);

  //creates a new cart, adds line item to it
  const [createCart, createCartData] = useMutation(createCartMutation, {
    variables: {
      cartInput: {
        lines: [
          {
            quantity: quantity,
            merchandiseId: id,
          },
        ],
      },
    },
  });

  //adds this item to an existing cart
  const [addToCart, addToCartData] = useMutation(addNewLineItemMutation, {
    variables: {
      cartId: user.cartId,
      lines: [
        {
          merchandiseId: id,
          quantity,
        },
      ],
    },
  });

  //update the quantity of this item if it is already in the cart
  const [updateQuantity, updateQuantityData] = useMutation(
    cartLinesUpdateMutation
  );

  const handleAddToCart = async () => {
    if (user.cartId) {
      //...if the user already has a cart in local storage

      //first, query the cache to get the latest version on the cart
      const { cart } = await client.readQuery({
        query: retrieveCartQuery,
        variables: {
          id: user.cartId,
        },
      });

      //next, check to see if that item is already in the cart or not
      const THIS_ITEM_IN_CART = cart.lines.edges.find(
        (element) => element.node.merchandise.id === id
      );

      //...and the item already exists in the cart
      if (THIS_ITEM_IN_CART) {
        //update quantity
        const THIS_LINE_id = THIS_ITEM_IN_CART.node.id;
        let newQuantity: number =
          Number(THIS_ITEM_IN_CART.node.quantity) + Number(quantity);
        updateQuantity({
          variables: {
            cartId: user.cartId,
            lines: {
              id: THIS_LINE_id,
              quantity: newQuantity,
            },
          },
        });

        return;
      }

      //...or if it isn't in the cart already
      if (!THIS_ITEM_IN_CART) {
        addToCart();
        return;
      }
    }

    if (!user.cartId) {
      //...and lastly, if no cart currently exists, create one
      const response = await createCart();
      setUser({ ...user, cartId: response.data.cartCreate.cart.id });
      return;
    }
  };

  return (
    <>
      <button
        onClick={handleAddToCart}
        className={
          type === "icon"
            ? "add-to-cart-button-icon button"
            : "add-to-cart-button-text button"
        }
      >
        {type === "icon" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="#000000"
            className="add-to-cart-icon"
          >
            <path d="M0 0h24v24H0zm18.31 6l-2.76 5z" fill="none" />
            <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z" />
          </svg>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#000000"
              className="add-to-cart-icon"
            >
              <path d="M0 0h24v24H0zm18.31 6l-2.76 5z" fill="none" />
              <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z" />
            </svg>
            Add to Cart
          </>
        )}
      </button>

      <style jsx>
        {`
          .button {
            width: 100%;
            height: 100%;
          }
          .add-to-cart-button-text {
            background-color: black;
            border: 4px solid white;
            color: white;

            transition: background-color 0.25s, color 0.25s;

            display: flex;
            justify-content: center;
            align-items: center;
          }

          .add-to-cart-button-text:hover {
            cursor: pointer;
            background-color: white;
            color: black;
          }

          .add-to-cart-button-icon {
            background-color: transparent;
            border: none;
          }

          .add-to-cart-icon {
            fill: white;
            height: 60%;
            width: auto;
          }

          .add-to-cart-icon:hover {
            cursor: pointer;
            fill: lime;
          }
        `}
      </style>
    </>
  );
};

export default AddToCartButton;
