import { useEffect } from "react";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { useAtom } from "jotai";
import { userAtom } from "../lib/atoms";

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useAtom(userAtom);
  useEffect(() => {
    if (user.isLoggedIn) {
    } else if (!user.isLoggedIn) {
    }
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />;
    </Layout>
  );
}

export default MyApp;
