import Image from "next/image";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../lib/atoms";
import {
  getProductByHandle,
  retrieveCartQuery,
  getCollectionByHandleQuery,
} from "../../lib/shopify";
import { useLazyQuery } from "@apollo/client";
import client from "../../lib/apollo";
import AddToCartButton from "../../components/AddToCartButton";

function Product({ TITLE, FEATURED_IMG, ID, HTML }) {
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useAtom(userAtom);

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
          <AddToCartButton id={ID} quantity={quantity} />
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
