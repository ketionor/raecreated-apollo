import { useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../lib/atoms";
import client from "../lib/apollo";
import { useMutation, useLazyQuery } from "@apollo/client";
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
  const [successMessage, setSuccessMessage] = useState(false);

  const displaySuccessMessage = () => {
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
  };

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

  const [loadCart, cartData] = useLazyQuery(retrieveCartQuery, {
    variables: {
      id: user.cartId,
    },
  });

  const handleAddToCart = async () => {
    if (user.cartId) {
      //...if the user already has a cart in local storage

      // first, query the cache to get the latest version on the cart
      const data = await client.readQuery({
        query: retrieveCartQuery,
        variables: {
          id: user.cartId,
        },
      });

      console.log(data);

      // //next, check to see if that item is already in the cart or not
      // const THIS_ITEM_IN_CART = data?.cart.lines.edges.find(
      //   (element) => element.node.merchandise.id === id
      // );

      // //...and the item already exists in the cart
      // if (THIS_ITEM_IN_CART) {
      //   //update quantity
      //   console.log("already in cart, updating");
      //   const THIS_LINE_id = THIS_ITEM_IN_CART.node.id;
      //   let newQuantity: number =
      //     Number(THIS_ITEM_IN_CART.node.quantity) + Number(quantity);
      //   updateQuantity({
      //     variables: {
      //       cartId: user.cartId,
      //       lines: {
      //         id: THIS_LINE_id,
      //         quantity: newQuantity,
      //       },
      //     },
      //   });

      //   displaySuccessMessage();
      //   return;
      // }

      //...or if it isn't in the cart already
      // if (!THIS_ITEM_IN_CART) {

      addToCart();
      displaySuccessMessage();
      return;
      // }
    }

    if (!user.cartId) {
      //...and lastly, if no cart currently exists, create one
      const response = await createCart();
      setUser({
        ...user,
        cartId: response.data.cartCreate.cart.id,
        checkoutUrl: response.data.cartCreate.cart.checkoutUrl,
      });
      displaySuccessMessage();
      return;
    }
  };

  return (
    <>
      {type === "icon" ? (
        <>
          {successMessage ? (
            <p className="text-pink-500 text-sm italic">Success!</p>
          ) : (
            <button
              onClick={handleAddToCart}
              className="w-full h-full p-0 flex-1"
            >
              <svg
                className="fill-current hover:text-pink-500 transition duration-300 h-full"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M0 0h24v24H0zm18.31 6l-2.76 5z" fill="none" />
                <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z" />
              </svg>
            </button>
          )}
        </>
      ) : (
        <>
          <button
            onClick={handleAddToCart}
            className="w-full h-full p-0 flex justify-center items-center bg-pink-500 hover:bg-pink-900 text-white font-bold py-2 px-4 rounded mt-4"
          >
            {successMessage ? (
              <p className="text-pink-500 text-sm italic">
                Success! Added to cart.
              </p>
            ) : (
              <>
                <svg
                  className="fill-current hover:text-pink-500 w-8 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M0 0h24v24H0zm18.31 6l-2.76 5z" fill="none" />
                  <path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-9.83-3.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4h-.01l-1.1 2-2.76 5H8.53l-.13-.27L6.16 6l-.95-2-.94-2H1v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.13 0-.25-.11-.25-.25z" />
                </svg>
                <p>Add to Cart</p>
              </>
            )}
          </button>
        </>
      )}
    </>
  );
};

export default AddToCartButton;
