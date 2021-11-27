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

function Product({ title, featuredImg, images, id, html }) {
  console.log(images);
  const [quantity, setQuantity] = useState<number>(1);
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
              src={featuredImg}
              alt="some alt"
            />
          </div>
          <div className="sub-image-container">
            {images.map((img, idx) => (
              <span key={idx} className="sub-image">
                <Image height={100} width={100} src={img.node.originalSrc} />
              </span>
            ))}
          </div>
        </div>
        <div className="purchase-container">
          {/* <h2>{price}</h2> */}
          <QuanititySelector quantity={quantity} setQuantity={setQuantity} />
          {/* <button onClick={handleBuyNow}>Buy Now</button> */}
          <AddToCartButton id={id} quantity={quantity} type="icon" />
        </div>
        <h1 className="title">{title}</h1>
        <div className="description">
          <div dangerouslySetInnerHTML={{ __html: html }} />
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

          .purchase-container {
            display: flex;
            justify-content: space-between;
            align-items: center;
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

  const title: string = data.shop.productByHandle.title;
  const featuredImg: string =
    data.shop.productByHandle.images.edges[0].node.originalSrc;
  const images: [] = data.shop.productByHandle.images.edges.slice(1);
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
