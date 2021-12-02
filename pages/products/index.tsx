import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import client from "../../lib/apollo";
import { getCollectionByHandleQuery } from "../../lib/shopify";
import ProductPreview from "../../components/ProductPreview";
import FadeInFadeOut from "../../components/Animations/FadeInFadeOut";
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

  const containerVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,

      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  return (
    <FadeInFadeOut>
      <motion.div
        className="flex flex-col items-center justify-center mt-24 ml-4 mr-4 max-w-5xl
        sm:grid sm:grid-flow-row sm:gap-4 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 "
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {products.map((product, idx) => {
          const featuredImage = product.node.images.edges[0].node.originalSrc;
          const title = product.node.title;
          const price = product.node.priceRange.minVariantPrice.amount;
          const slug = product.node.handle;
          const id = product.node.variants.edges[0].node.id;

          return (
            <motion.span key={idx} variants={itemVariants}>
              <ProductPreview
                featuredImage={featuredImage}
                title={title}
                price={price}
                slug={slug}
                id={id}
              />
            </motion.span>
          );
        })}
      </motion.div>
    </FadeInFadeOut>
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
