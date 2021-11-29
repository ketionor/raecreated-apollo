import Image from "next/image";
import Link from "next/link";
import client from "../../lib/apollo";
import { getCollectionByHandleQuery } from "../../lib/shopify";

import { gql } from "@apollo/client";
import AddToCartButton from "../../components/AddToCartButton";
import ProductPreview from "../../components/ProductPreview";
// import ProductsPage from "../../components/ProductsPage/ProductsPage";

function Products({ products }) {
  //   console.log(JSON.stringify(products, null, 40));
  return (
    <>
      <div className="flex flex-wrap justify-center mt-24 p-4">
        {products.map((product) => {
          console.log(product);
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
  const { data } = await client.query({ query: getCollectionByHandleQuery });

  return {
    props: {
      products: data.shop.collectionByHandle.products.edges,
    },
  };
}

export default Products;
