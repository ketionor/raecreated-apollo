import { useAtom } from "jotai";
import { userAtom } from "./atoms";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESSTOKEN;

export async function ShopifyData(query: Object, variables: Object = {}) {
  const URL = `https://thread-and-scissor-hands.myshopify.com/api/2021-10/graphql.json`;

  const options = {
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": "4ebfabcacbaa2d69010004d3cb4c9a57",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  };

  try {
    const response = await fetch(URL, options);
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

export async function createCart(variantId: String, quantity: Number) {
  const cartInput = {
    cartInput: {
      lines: [
        {
          quantity: quantity,
          merchandiseId: variantId,
        },
      ],
    },
  };

  const { data } = await ShopifyData(createCartMutation, cartInput);
  const cartId = data.cartCreate.cart.id;
}

export async function buyItNow(variantId: String) {
  const { data } = await ShopifyData(buyNowMutation, { variantId });
  const { webUrl } = data.checkoutCreate.checkout;
  window.location.href = webUrl;
}

export async function getProductByHandle(handle: String) {
  const query = `
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
`;

  const { data } = await ShopifyData(query);
  return data.shop.productByHandle;
}

export async function createCustomer(
  email: String,
  password: String,
  acceptsMarketing: Boolean,
  firstName?: String,
  lastName?: String,
  phone?: String
) {
  const input = {
    input: {
      firstName,
      lastName,
      phone,
      email,
      password,
      acceptsMarketing,
    },
  };

  const { data } = await ShopifyData(createCustomerMutation, input);
  console.log(data);
}

export async function createAccessToken(email: String, password: String) {
  const input = {
    input: {
      email,
      password,
    },
  };

  const { data } = await ShopifyData(createAccessTokenMutation, input);
  return data;
}

const gql = String.raw;

const createCartMutation = gql`
  mutation createCart($cartInput: CartInput) {
    cartCreate(input: $cartInput) {
      cart {
        id
        createdAt
        updatedAt
        lines(first: 10) {
          edges {
            node {
              id
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
        estimatedCost {
          totalAmount {
            amount
            currencyCode
          }
          subtotalAmount {
            amount
            currencyCode
          }
          totalTaxAmount {
            amount
            currencyCode
          }
          totalDutyAmount {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

const buyNowMutation = gql`
  mutation CheckoutCreate($variantId: ID!) {
    checkoutCreate(
      input: { lineItems: { variantId: $variantId, quantity: 1 } }
    ) {
      checkout {
        webUrl
      }
    }
  }
`;

const createCustomerMutation = gql`
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

const createAccessTokenMutation = gql`
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
