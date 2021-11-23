import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://thread-and-scissor-hands.myshopify.com/api/2021-10/graphql.json",
  cache: new InMemoryCache(),
  headers: {
    "X-Shopify-Storefront-Access-Token": "4ebfabcacbaa2d69010004d3cb4c9a57",
    "Content-Type": "application/json",
  },
});

export default client;
