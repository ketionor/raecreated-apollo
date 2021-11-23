import Error from "next/error";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../lib/atoms";
import {
  createCartMutation,
  getProductByHandle,
  addNewLineItemMutation,
  retrieveCartQuery,
  cartLinesUpdateMutation,
  getCollectionByHandleQuery,
} from "../../lib/shopify";
import { useMutation, gql, useQuery, useLazyQuery } from "@apollo/client";
import client from "../../lib/apollo";
import AddToCartButton from "../../components/AddToCartButton";

function Product({ TITLE, FEATURED_IMG, ID, HTML }) {
  const [quantity, setQuantity] = useState(1);
  const [cartId, setCartID] = useState("");
  const [user, setUser] = useAtom(userAtom);

  const [lazyRetrieveCart, lazyRetrieveCartData] = useLazyQuery(
    retrieveCartQuery,
    {
      variables: { id: user.cartId },
    }
  );

  useEffect(() => {
    //since the apollo in memory cache is used to store the current cart,
    //check to make sure that the cart is in the cache, if it exists
    user.cartId && lazyRetrieveCart();
  }, []);

  //creates a new cart, adds line item to it
  const [createCart, createCartData] = useMutation(createCartMutation, {
    variables: {
      cartInput: {
        lines: [
          {
            quantity: quantity,
            merchandiseId: ID,
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
          merchandiseId: ID,
          quantity,
        },
      ],
    },
  });

  //update the quantity of this item if it is already in the cart
  const [updateQuantity, updateQuantityData] = useMutation(
    cartLinesUpdateMutation
  );

  const handleBuyNow = async () => {
    const { cart } = await client.readQuery({
      query: retrieveCartQuery,
      variables: {
        id: user.cartId,
      },
    });

    console.log(cart);
  };

  const handleUpdateQuantity = async (e) => {
    setQuantity(Number(e.target.value));
  };

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
        (element) => element.node.merchandise.id === ID
      );

      if (THIS_ITEM_IN_CART) {
        //update quantity
        const THIS_LINE_ID = THIS_ITEM_IN_CART.node.id;
        let newQuantity = THIS_ITEM_IN_CART.node.quantity + quantity;
        updateQuantity({
          variables: {
            cartId: user.cartId,
            lines: {
              id: THIS_LINE_ID,
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
      <div className="page-container">
        <div className="image-container">
          <div className="featured-image-container">
            <Image
              layout="responsive"
              height={1}
              width={1}
              src={FEATURED_IMG}
              alt="some alt"
            />
          </div>
          <div className="sub-image-container">
            {/* {images.map((img, idx) => (
              <span key={idx} className="sub-image">
                <Image height={100} width={100} src={img.node.originalSrc} />
              </span>
            ))} */}
          </div>
        </div>
        <div className="info-container">
          <h1 className="title">{TITLE}</h1>
          {/* <h2>{price}</h2> */}
          <input
            type="number"
            value={quantity}
            onChange={handleUpdateQuantity}
          />
          <button onClick={handleBuyNow}>Buy it Now</button>
          {/* <button onClick={handleAddToCart}>Add to Cart</button> */}
          <AddToCartButton id={ID} />
        </div>
        <div className="description">
          <div dangerouslySetInnerHTML={{ __html: HTML }} />
        </div>
      </div>

      <style jsx>
        {`
          .product-container {
            width: 100%;
          }

          .featured-image-container {
            width: 100%;
          }

          .sub-image-container {
            display: flex;
            flex-wrap: wrap;

            margin-top: 1rem;
            margin-bottom: 1rem;
          }

          .sub-image:not(:first-child) {
            margin-left: 1rem;
          }

          .title {
            font-size: 2em;
          }
        `}
      </style>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { data } = await getProductByHandle(params.slug);

  // console.log(data.shop.productByHandle);

  const TITLE = data.shop.productByHandle.title;
  const FEATURED_IMG =
    data.shop.productByHandle.images.edges[0].node.originalSrc;
  const ID = data.shop.productByHandle.variants.edges[0].node.id;
  const HTML = data.shop.productByHandle.descriptionHtml;

  return {
    props: {
      TITLE,
      FEATURED_IMG,
      ID,
      HTML,
    },
  };
}

export async function getStaticPaths() {
  const { data } = await client.query({ query: getCollectionByHandleQuery });

  console.log(data);
  const slugs = data.shop.collectionByHandle.products.edges.map((product) => ({
    params: { slug: product.node.handle },
  }));
  return {
    paths: slugs,
    fallback: false,
  };
}

export default Product;
