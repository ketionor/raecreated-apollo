import { gql } from "@apollo/client";
import client from "./apollo";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN;

// export async function buyItNow(variantId: String) {
//   const { data } = await ShopifyData(buyNowMutation, { variantId });
//   const { webUrl } = data.checkoutCreate.checkout;
//   window.location.href = webUrl;
// }

export async function getProductByHandle(handle: String) {
  const data = client.query({
    query: gql`
  {
    shop {
      productByHandle(handle: "${handle}") {
        id
        title
        handle
        tags
        descriptionHtml
        priceRange {
          minVariantPrice {
            amount
          }
        }
        images(first: 10) {
          edges {
            node {
              originalSrc
            }
          }
        }
        variants(first:1) {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`,
  });
  return data;
}

// export async function createCustomer(
//   email: string,
//   password: string,
//   acceptsMarketing: boolean,
//   firstName?: string,
//   lastName?: string,
//   phone?: string
// ) {
//   const input = {
//     input: {
//       firstName,
//       lastName,
//       phone,
//       email,
//       password,
//       acceptsMarketing,
//     },
//   };

//   const { data } = await ShopifyData(createCustomerMutation, input);
//   console.log(data);
// }

// export async function createAccessToken(email: String, password: String) {
//   const input = {
//     input: {
//       email,
//       password,
//     },
//   };

//   const { data } = await ShopifyData(createAccessTokenMutation, input);
//   return data;
// }
const cartQueryFragment = `
    cart(id: $id) {
      id
      checkoutUrl
      lines(first: 250) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
                product {
                  images(first: 1) {
                    edges {
                      node {
                        originalSrc
                      }
                    }
                  }
                  id
                  handle
                  title
                }
              }
            }
            quantity
            estimatedCost {
              subtotalAmount {
                amount
              }
            }
          }
        }
      }
  }
`;

const cartQueryFragmentWithoutId = `
    cart {
      id
      checkoutUrl
      lines(first: 250) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
                product {
                  handle
                  images(first: 1) {
                    edges {
                      node {
                        originalSrc
                      }
                    }
                  }
                  id
                  handle
                  title
                }
              }
            }
            quantity
            estimatedCost {
              subtotalAmount {
                amount
              }
            }
          }
        }
      }
  }
`;

export const createCartMutation = gql`
  mutation createCart($cartInput: CartInput) {
    cartCreate(input: $cartInput) {
      ${cartQueryFragmentWithoutId}
    }
  }
`;

// const buyNowMutation = gql`
//   mutation CheckoutCreate($variantId: ID!) {
//     checkoutCreate(
//       input: { lineItems: { variantId: $variantId, quantity: 1 } }
//     ) {
//       checkout {
//         webUrl
//       }
//     }
//   }
// `;

export const createCustomerMutation = gql`
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customer {
        id
      }
    }
  }
`;

export const createAccessTokenMutation = gql`
  mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerUserErrors {
        code
        field
        message
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
    }
  }
`;

export const cartLinesUpdateMutation = gql`
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      ${cartQueryFragmentWithoutId}
    }
  }
`;

export const addNewLineItemMutation = gql`
  mutation cartLinesAdd($lines: [CartLineInput!]!, $cartId: ID!) {
    cartLinesAdd(lines: $lines, cartId: $cartId) {
      ${cartQueryFragmentWithoutId}
      userErrors {
        code
        field
        message
      }
    }
  }
`;

export const retrieveCartQuery = gql`
  query ($id: ID!) {
    ${cartQueryFragment}
  }
`;

export const getCollectionByHandleQuery = gql`
  query getCollectionByHandle($handle: String!, $first: Int!) {
    shop {
      collectionByHandle(handle: $handle) {
        products(first: $first) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              title
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
              variants(first: 1) {
                edges {
                  node {
                    id
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

export const cartBuyerIdentityUpdateMutation = gql`
mutation cartBuyerIdentityUpdate($cartId: ID!, $buyerIdentity: CartBuyerIdentityInput!) {
  cartBuyerIdentityUpdate(cartId: $cartId, buyerIdentity: $buyerIdentity) {
    ${cartQueryFragmentWithoutId}
    userErrors {
      code
      field
      message
    }
  }
}

`;

export const cartLinesRemoveMutation = gql`
mutation removeLines($cartId: ID!, $lineIds: [ID!]!) {
  cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
    ${cartQueryFragmentWithoutId}
  }
}

`;
