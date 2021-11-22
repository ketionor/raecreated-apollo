import Error from "next/error";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
// import ProductsPage from "../../components/ProductsPage/ProductsPage";

import { ShopifyData } from "../../lib/shopify";

function Products({ products }) {
  //   console.log(JSON.stringify(products, null, 40));
  return (
    <>
      {products.map((product) => {
        const featuredImage = product.node.images.edges[0].node.originalSrc;
        const title = product.node.title;
        const price = product.node.priceRange.minVariantPrice.amount;
        const slug = product.node.handle;

        return (
          <>
            <Link href={`/products/${slug}`} passHref>
              <div>
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
          </>
        );
      })}
    </>
  );
}

const gql = String.raw;

const pageQuery = gql`
  {
    shop {
      collectionByHandle(handle: "always-in-stock") {
        products(first: 10) {
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

export async function getStaticProps() {
  const { data } = await ShopifyData(pageQuery);

  console.log(data.shop.collectionByHandle.products.edges);

  return {
    props: {
      products: data.shop.collectionByHandle.products.edges,
    },
  };
}

export default Products;
