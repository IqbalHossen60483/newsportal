import LoginRegister from "../components/common/LoginRegister";
import Footer from "../components/common/footer/Footer";
import useStore from "../components/context/useStore";
import GotoTop from "../components/common/GotoTop";
import Alert from "../components/common/Alert";
import "react-multi-carousel/lib/styles.css";
import { useRouter } from "next/router";
import "../styles/category.css";
import "../styles/globals.css";
import "../styles/details.css";
import "../styles/header.css";
import "../styles/home.css";
import "../styles/dashboard.css";
import SideMenu from "../components/common/SideMenu";
import Head from "next/head";
import Spinner from "../components/common/Spinner";
import StoreProvider from "../components/context/StoreProvider";

function Layout({ Component, pageProps }) {
  const router = useRouter();
  const noFooter = ["/login", "/register"];
  const store = useStore();

  return (
    <div>
      <Head>
        <title>{store?.siteInfo?.name}</title>
      </Head>
      <Component {...pageProps} />
      <GotoTop />
      {!noFooter.includes(router.pathname) &&
        !router.pathname.includes("/admin") && <Footer />}
      {store?.showLoginRegister && <LoginRegister />}
      <SideMenu />
      {store?.alert.msg && <Alert />}
      {store?.loading && <Spinner />}
    </div>
  );
}

function MyApp({ Component, pageProps }) {
  return (
    <StoreProvider>
      <Layout Component={Component} pageProps={pageProps} />
    </StoreProvider>
  );
}

export default MyApp;
