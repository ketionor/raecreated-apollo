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
import FadeInFadeOut from "../../components/Animations/FadeInFadeOut";

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
    <FadeInFadeOut>
      <div className="w-full mt-24 p-4 sm:grid sm:grid-cols-2">
        <div className="sm:max-w-sm">
          <div className="w-full">
            <Image
              layout="responsive"
              height={1}
              width={1}
              src={images[featuredImg].node.originalSrc}
              alt={title}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 grid-flow-row mt-4 mb-4 ">
            {images.map((img, idx) => (
              <span key={idx} className="" onClick={() => setFeaturedImg(idx)}>
                <Image
                  height={1}
                  width={1}
                  src={img.node.originalSrc}
                  layout="responsive"
                  alt={title}
                />
              </span>
            ))}
          </div>
        </div>
        <div className="right-container">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <div className={readMore ? "" : "gradient-mask-b-0"}>
            <div
              dangerouslySetInnerHTML={{
                __html: `${readMore ? html : html.slice(0, 150)}`,
              }}
            />
          </div>
          <p
            className="text-center italic underline mb-4 cursor-pointer"
            onClick={() => {
              setReadMore(!readMore);
            }}
          >
            {`Show ${readMore ? "Less" : "More"}`}
          </p>
          <hr />
          <div className="flex flex-col items-center">
            {/* <h2>{price}</h2> */}
            <div className="w-1/3 h-8 mt-4 ">
              <QuanititySelector
                quantity={quantity}
                setQuantity={setQuantity}
              />
            </div>
            {/* <button onClick={handleBuyNow}>Buy Now</button> */}
            <div onClick={() => {}} className="w-full h-12">
              <AddToCartButton id={id} quantity={quantity} type="text" />
            </div>
          </div>
        </div>
      </div>
    </FadeInFadeOut>
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
  const { data } = await client.query({
    query: getCollectionByHandleQuery,
    variables: { handle: "always-in-stock", first: 100 },
  });

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
