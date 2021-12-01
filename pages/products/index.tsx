import Image from "next/image";
import Link from "next/link";
import client from "../../lib/apollo";
import { getCollectionByHandleQuery } from "../../lib/shopify";

import { gql, useQuery } from "@apollo/client";
import AddToCartButton from "../../components/AddToCartButton";
import ProductPreview from "../../components/ProductPreview";
// import ProductsPage from "../../components/ProductsPage/ProductsPage";

function Products({ products }) {
  //   console.log(JSON.stringify(products, null, 40));
  // const { loading, data, fetchMore } = useQuery(getCollectionByHandleQuery, {
  //   variables: {
  //     handle: "always-in-stock",
  //     // after: 0,
  //     first: 10,
  //   },
  // });

  return (
    <>
      {/* <h1 className="text-4xl">In Stock</h1> */}
      <div
        className="flex flex-col items-center justify-center mt-24 p-4
        sm:grid sm:grid-flow-row sm:gap-4 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 "
      >
        {products.map((product) => {
          const featuredImage = product.node.images.edges[0].node.originalSrc;
          const title = product.node.title;
          const price = product.node.priceRange.minVariantPrice.amount;
          const slug = product.node.handle;
          const id = product.node.variants.edges[0].node.id;

          return (
            <>
              <ProductPreview
                featuredImage={featuredImage}
                title={title}
                price={price}
                slug={slug}
                id={id}
              />
            </>
          );
        })}
      </div>
    </>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: getCollectionByHandleQuery,
    variables: { handle: "always-in-stock", first: 100 },
  });

  return {
    props: {
      products: data.shop.collectionByHandle.products.edges,
    },
  };
}

export default Products;
