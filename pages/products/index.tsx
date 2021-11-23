import Image from "next/image";
import Link from "next/link";
import client from "../../lib/apollo";
import { getCollectionByHandleQuery } from "../../lib/shopify";

import { gql } from "@apollo/client";
import AddToCartButton from "../../components/AddToCartButton";
// import ProductsPage from "../../components/ProductsPage/ProductsPage";

function Products({ products }) {
  //   console.log(JSON.stringify(products, null, 40));
  return (
    <>
      <div className="page-container">
        {products.map((product) => {
          console.log(product);
          const featuredImage = product.node.images.edges[0].node.originalSrc;
          const title = product.node.title;
          const price = product.node.priceRange.minVariantPrice.amount;
          const slug = product.node.handle;
          const id = product.node.variants.edges[0].node.id;

          return (
            <>
              <Link href={`/products/${slug}`} passHref>
                <div className="single-product">
                  <Image
                    height={100}
                    width={100}
                    layout="responsive"
                    src={featuredImage}
                  />
                  <h1>{title}</h1>
                  <h2>{price}</h2>
                </div>
              </Link>
              <AddToCartButton id={id} quantity={1} />
            </>
          );
        })}
      </div>

      <style jsx>
        {`
          .page-container {
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
          }

          .single-product {
            width: 75%;
          }

          @media only screen and (min-width: 768px) {
            .page-container {
              display: flex;
              flex-wrap: wrap;
            }

            .single-product {
              width: 40%;
              margin: 2rem;
            }
          }
        `}
      </style>
    </>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({ query: getCollectionByHandleQuery });

  return {
    props: {
      products: data.shop.collectionByHandle.products.edges,
    },
  };
}

export default Products;
