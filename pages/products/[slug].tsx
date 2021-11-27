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
import QuanititySelector from "../../components/QuanititySelector";

function Product({ title, images, id, html }) {
  console.log(images);
  const [quantity, setQuantity] = useState<number>(1);
  const [readMore, setReadMore] = useState(false);
  const [featuredImg, setFeaturedImg] = useState<number>(0);
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
              src={images[featuredImg].node.originalSrc}
              alt="some alt"
            />
          </div>
          <div className="sub-image-container">
            {images.map((img, idx) => (
              <span
                key={idx}
                className="sub-image"
                onClick={() => setFeaturedImg(idx)}
              >
                <Image
                  height={1}
                  width={1}
                  src={img.node.originalSrc}
                  layout="responsive"
                />
              </span>
            ))}
          </div>
        </div>
        <h1 className="title">{title}</h1>
        <div className={readMore ? "description" : "description fade-bottom"}>
          <div
            dangerouslySetInnerHTML={{
              __html: `${readMore ? html : html.slice(0, 150)}`,
            }}
          />
        </div>
        <p
          className="read-more"
          onClick={() => {
            setReadMore(!readMore);
          }}
        >
          {`Show ${readMore ? "Less" : "More"}`}
        </p>
        <hr />
        <div className="purchase-container">
          {/* <h2>{price}</h2> */}
          <span className="quantity-selector">
            <QuanititySelector quantity={quantity} setQuantity={setQuantity} />
          </span>
          {/* <button onClick={handleBuyNow}>Buy Now</button> */}
          <span onClick={() => {}} className="add-to-cart-button">
            <AddToCartButton id={id} quantity={quantity} type="text" />
          </span>
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

          .sub-image {
            flex-grow: 1;
          }

          .purchase-container {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
          }

          .description {
          }

          .fade-bottom {
            -webkit-mask-image: linear-gradient(
              to bottom,
              black 50%,
              transparent 100%
            );
            mask-image: linear-gradient(to bottom, black 50%, transparent 100%);
          }

          .quantity-selector {
            height: 30px;
            width: 50%;
            margin-top: 1rem;
            margin-bottom: 1rem;
          }

          .add-to-cart-button {
            width: 100%;
            height: 50px;
          }

          .title {
            font-size: 2em;
          }

          .read-more {
            text-align: center;
            font-size: small;
            font-style: italic;
            text-decoration: underline;
          }

          .read-more:hover {
            cursor: pointer;
          }
        `}
      </style>
    </>
  );
}

export async function getStaticProps({ params }) {
  const { data } = await getProductByHandle(params.slug);

  const title: string = data.shop.productByHandle.title;
  const featuredImg: string =
    data.shop.productByHandle.images.edges[0].node.originalSrc;
  const images: [] = data.shop.productByHandle.images.edges;
  const id: string = data.shop.productByHandle.variants.edges[0].node.id;
  const html: string = data.shop.productByHandle.descriptionHtml;

  console.log(images);
  return {
    props: {
      title,
      featuredImg,
      images,
      id,
      html,
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
