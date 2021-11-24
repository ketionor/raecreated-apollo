import { useAtom } from "jotai";
import { userAtom } from "../lib/atoms";
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
}

//created this component for the sole purpose of housing the
//sizable add to cart function
const AddToCartButton = ({ id, quantity }: AddToCartButton) => {
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
      //if the user already has a cart in local storage

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
      } else {
        //create new line item
        addToCart();
      }
    } else {
      //if the user does not already have a cart
      const response = await createCart();
      setUser({ ...user, cartId: response.data.cartCreate.cart.id });
    }
  };

  return (
    <>
      <button onClick={handleAddToCart} className="add-to-cart-button">
        Add to Cart
      </button>

      <style jsx>
        {`
          .add-to-cart-button {
            background-color: black;
            color: white;
            border: 2px solid white;
            transition: background-color 0.25s, color 0.25s;
          }

          .add-to-cart-button:hover {
            cursor: pointer;
            background-color: white;
            color: black;
          }
        `}
      </style>
    </>
  );
};

export default AddToCartButton;
