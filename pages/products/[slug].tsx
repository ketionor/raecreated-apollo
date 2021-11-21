import Error from "next/error";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useAtom } from "jotai";
import { userAtom, cartAtom } from "../../lib/atoms";
import { updateCartQuantity } from "../../lib/shopify";
// import ProductsPage from "../../components/ProductsPage/ProductsPage";

import {
  ShopifyData,
  createCart,
  buyItNow,
  getProductByHandle,
} from "../../lib/shopify";

function Product({ product }) {
  const [isLoading, setIsLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useAtom(userAtom);
  const [cart, setCart] = useAtom(cartAtom);

  // console.log(JSON.stringify(product, null, 40));

  const featuredImage = product.images.edges[0].node.originalSrc;
  const images = product.images.edges.slice(1);
  const title = product.title;
  const price = product.priceRange.minVariantPrice.amount;
  const slug = product.handle;
  const html = product.descriptionHtml;
  const variantId = product.variants.edges[0].node.id;

  const handleBuyNow = async () => {
    buyItNow(variantId);
  };

  const handleUpdateQuantity = async (e) => {
    setQuantity(Number(e.target.value));
  };

  const handleAddToCart = async () => {
    if (user.cartId) {
      //handle updating cart
      //checks to see if this variant is already in the cart, if it is, returns the id
      const exists = cart.lines.edges.find(
        (element) => element.node.merchandise.id === variantId
      );
      if (exists) {
        //update quantity
        let id = exists.node.id;
        let num = exists.node.quantity + quantity;
        const { data } = await updateCartQuantity(user.cartId, id, num);
        setCart(Object.assign(cart, data.cartLinesUpdate.cart));
      } else {
        //create new line
      }
    } else {
      //create a new cartand add the item
      const data = await createCart(variantId, 1);
      setUser({ ...user, cartId: data.cartCreate.cart.id });
      setCart(Object.assign(cart, data.cartCreate.cart));
    }
  };

  return (
    <>
      <div>
        <div className="image-container">
          <div className="featured-image-container">
            <Image
              layout="responsive"
              height={1}
              width={1}
              src={featuredImage}
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
        <div className="info-container">
          <h1 className="title">{title}</h1>
          <h2>{price}</h2>
          <input
            type="number"
            value={quantity}
            onChange={handleUpdateQuantity}
          />
          <button onClick={handleBuyNow}>Buy it Now</button>
          <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
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

          .title {
            font-size: 2em;
          }
        `}
      </style>
    </>
  );
}

const gql = String.raw;

export async function getStaticProps({ params }) {
  const product = await getProductByHandle(params.slug);

  return {
    props: {
      product,
    },
  };
}

export async function getStaticPaths() {
  const { data } = await ShopifyData(pageQuery);
  const slugs = data.shop.collectionByHandle.products.edges.map((product) => ({
    params: { slug: product.node.handle },
  }));
  return {
    paths: slugs,
    fallback: false,
  };
}

export default Product;

const pageQuery = gql`
  {
    shop {
      collectionByHandle(handle: "always-in-stock") {
        products(first: 1) {
          edges {
            node {
              id
              handle
              tags
              priceRange {
                minVariantPrice {
                  amount
                }
              }
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
