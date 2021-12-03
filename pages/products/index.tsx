import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import client from "../../lib/apollo";
import { getCollectionByHandleQuery } from "../../lib/shopify";
import ProductPreview from "../../components/ProductPreview";
import FadeInFadeOut from "../../components/Animations/FadeInFadeOut";
import FilterModal from "../../components/FilterModal";
import Unfold from "../../components/UI/Unfold";
// import ProductsPage from "../../components/ProductsPage/ProductsPage";

function Products({ products, uniqueTags }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentProducts, setProducts] = useState([]);
  const [tags, setTags] = useState(["loading"]);
  const [filter, setFilter] = useState("always");

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

  useEffect(() => {
    const filteredProducts = products.filter((product) => {
      const tags = product.node.tags;
      return tags.includes(filter);
    });

    const tagList = uniqueTags.map((tag, idx) => {
      return (
        <button
          key={idx}
          onClick={() => {
            setFilter(tag);
            setModalIsOpen(false);
          }}
          className="border-2 rounded-3xl pt-2 pb-2 pr-4 pl-4 mr-2 mb-2 cursor-pointer hover:bg-pink-500 focus:bg-pink-900"
        >
          {tag}
        </button>
      );
    });

    setTags(tagList);
    setProducts(filteredProducts);
  }, [filter, products]);

  return (
    <FadeInFadeOut>
      <div className="flex flex-col items-center justify-center mt-24 ml-4 mr-4 max-w-5xl">
        <div className="flex justify-between w-full mb-2">
          <h2 className="self-start text-4xl">In Stock</h2>
          <button
            className="lg:hidden flex justify-center items-center text-xl"
            onClick={() => setModalIsOpen(true)}
          >
            Filter
            <Unfold />
          </button>
        </div>
        {modalIsOpen && <FilterModal tags={tags} />}
        <div className="lg:grid lg:grid-cols-12">
          <div className="hidden lg:flex flex-col col-span-3 row-span-2">
            <p className="text-2xl mb-4">Tags</p>
            <div className="">{tags}</div>
          </div>
          <motion.div
            className="lg:col-span-9 mb-4 grid grid-cols-1 gap-4 
              sm:grid-flow-row sm:gap-4 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4"
            variants={currentProducts?.length > 0 && containerVariants}
            initial="hidden"
            animate="show"
            key={filter}
          >
            {currentProducts?.length > 0 &&
              currentProducts.map((product, idx) => {
                const featuredImage =
                  product.node.images.edges[0].node.originalSrc;
                const title = product.node.title;
                const price = product.node.priceRange.minVariantPrice.amount;
                const slug = product.node.handle;
                const id = product.node.variants.edges[0].node.id;
                return (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="shadow-lg bg-gray-800 rounded-lg"
                  >
                    <ProductPreview
                      featuredImage={featuredImage}
                      title={title}
                      price={price}
                      slug={slug}
                      id={id}
                    />
                  </motion.div>
                );
              })}
          </motion.div>
        </div>
      </div>
    </FadeInFadeOut>
  );
}

export async function getStaticProps() {
  const { data } = await client.query({
    query: getCollectionByHandleQuery,
    variables: { handle: "always-in-stock", first: 100 },
  });

  let allTags = data?.shop.collectionByHandle.products.edges.reduce((a, b) => {
    return [...a, ...b.node.tags];
  }, []);
  let uniqueTags = [...new Set<>(allTags)];

  return {
    props: {
      products: data.shop.collectionByHandle.products.edges,
      uniqueTags,
    },
  };
}

export default Products;
