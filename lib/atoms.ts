import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

interface User {
  isLoggedIn: Boolean;
  accessToken?: String;
  cartId?: String;
}

export const userAtom = atomWithStorage<User>("userInfo", {
  isLoggedIn: false,
});

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
