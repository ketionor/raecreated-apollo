import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

interface User {
  customerId?: string;
  accessToken?: string;
  cartId?: string;
}

export const userAtom = atomWithStorage<User>("userInfo", {});

interface Cart {
  lines?: {
    edges: [
      {
        node: {
          id: String;
          merchandise: {
            id: String;
          };
          quantity: number;
        };
      }
    ];
  };
}

export const cartAtom = atomWithStorage<Cart>("cartInfo", {});
