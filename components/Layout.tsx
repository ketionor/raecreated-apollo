import { useEffect } from "react";
import Nav from "./Nav/Nav";
import { useAtom } from "jotai";
import { userAtom } from "../lib/atoms";
import { useLazyQuery } from "@apollo/client";
import { retrieveCartQuery } from "../lib/shopify";

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
      <div className="global-container">
        <Nav />
        <main className="content-container">{children}</main>
      </div>

      <style jsx>
        {`
          .global-container {
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .content-container {
            width: 100%;
            min-height: 100vh;
            padding: 1rem;
            max-width: 1024px;
          }
        `}
      </style>
    </>
  );
};

export default Layout;
