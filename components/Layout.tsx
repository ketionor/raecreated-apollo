import { useEffect } from "react";
import Nav from "./Nav/Nav";
import { useAtom } from "jotai";
import { userAtom } from "../lib/atoms";
import { useLazyQuery } from "@apollo/client";
import { retrieveCartQuery } from "../lib/shopify";
import "tailwindcss/tailwind.css";

const Layout = ({ children }) => {
  const [user, setUser] = useAtom(userAtom);

  const [lazyRetrieveCart, lazyRetrieveCartData] = useLazyQuery(
    retrieveCartQuery,
    {
      variables: { id: user.cartId },
    }
  );

  useEffect(() => {
    //since the apollo in memory cache is used to store the current cart,
    //check to make sure that the cart is in the cache, if it exists
    user.cartId && lazyRetrieveCart();
  }, []);

  return (
    <>
      <div className="w-screen h-screen flex flex-col items-center p-4">
        <Nav />
        <main className="w-full max-w-5xl min-h-screen mt-4">{children}</main>
      </div>
    </>
  );
};

export default Layout;
