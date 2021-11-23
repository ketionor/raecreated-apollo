import React from "react";
import Cart from "../components/Cart";

import { gql } from "@apollo/client";
import client from "../lib/apollo";

const cart = ({ data }) => {
  console.log(data);
  return (
    <div>
      <Cart />
    </div>
  );
};

export default cart;

export async function getServerSideProps() {
  const { data } = await client.query({
    query: gql`
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
    `,
  });

  return {
    props: {
      data,
    },
  };
}
