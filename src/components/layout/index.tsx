// layout.tsx
import { ReactNode, useEffect, useState } from "react";
// Create this component if it doesn't exist
import { useRouter } from "next/router";
import { getCartFromLocalStorage } from "@/utils/cart";
import Script from "next/script";
import Header from "../Header";

interface LayoutProps {
  children: ReactNode;
  isFooter?: boolean;
  isCart?: boolean;
}

const Layout = ({ children, isFooter = true, isCart = true }: LayoutProps) => {
  const router = useRouter();
  const { query } = router;
  //   const cart = getCartFromLocalStorage();
  const [cart, setCart] = useState<any[]>([]);
  const [isSearchComponent, setIsSearchComponent] = useState(false);

  const setFunction = (val: boolean) => {
    setIsSearchComponent(val);
  };

  useEffect(() => {
    setCart(getCartFromLocalStorage());
  }, []);

  return (
    <div
      style={{
        backgroundColor: "black",
      }}
    >
      <meta charSet="utf-8" />
      <meta name="author" content="codexcoder" />
      <meta name="description" content="" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {/* <link rel="icon" type="image/png" href="assets/images/favicon.png" /> */}
      <link rel="icon" href="favicon.jpg" />
      {/* ====== All css file ========= */}
      <link rel="stylesheet" href="/assets/css/bootstrap.min.css" />
      <link rel="stylesheet" href="/assets/css/icofont.min.css" />
      <link rel="stylesheet" href="/assets/css/lightcase.css" />
      <link rel="stylesheet" href="/assets/css/animate.css" />
      <link rel="stylesheet" href="/assets/css/swiper-bundle.min.css" />
      <link rel="stylesheet" href="/assets/css/style.min.css" />
      {/* site title */}
      <title>SINGH DOMAIN APP</title>

      <Header
        setFunction={setFunction}
        isSearchComponent={isSearchComponent}
        cart={cart}
        isCart={isCart}
      />
      {children}

      {isFooter && (
        <footer className="footer-section style-4">
          <div
            className="footer-top"
            style={{ backgroundImage: "url(assets/images/footer/bg-4.jpg)" }}
          >
            <div className="footer-newsletter">
              <div className="container">
                <div className="row g-4 align-items-center justify-content-center">
                  <div className="col-lg-12">
                    {/* <div className="newsletter-part">
                    <div className="ft-header">
                      <h4>Get The Latest Rarible Updates</h4>
                    </div>
                    <form action="#">
                      <input type="email" placeholder="Your Mail Address" />
                      <button type="submit" data-blast="bgColor">
                        Subscribe now
                      </button>
                    </form>
                  </div> */}
                  </div>
                  <div className="col-lg-12">
                    <div
                      className="social-part ps-lg-5"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div className="ft-header">
                        <h4>Join the Community</h4>
                      </div>
                      <ul className="social-list d-flex flex-wrap align-items-center mb-0">
                        <li className="social-link">
                          <a
                            href="https://x.com/SinghTheApp"
                            data-blast="bgColor"
                          >
                            <i className="icofont-twitter" />
                          </a>
                        </li>
                        {/* <li className="social-link">
                        <a href="#" data-blast="bgColor">
                          <i className="icofont-twitch" />
                        </a>
                      </li> */}
                        {/* <li className="social-link">
                        <a href="#" data-blast="bgColor">
                          <i className="icofont-reddit" />
                        </a>
                      </li> */}
                        <li className="social-link">
                          <a
                            href="https://www.instagram.com/singhtheapp/"
                            data-blast="bgColor"
                          >
                            <i className="icofont-instagram" />
                          </a>
                        </li>
                        <li className="social-link">
                          <a
                            href="https://www.facebook.com/singhtheapp"
                            data-blast="bgColor"
                          >
                            <i className="icofont-facebook" />
                          </a>
                        </li>
                        <li className="social-link">
                          <a
                            href="https://www.linkedin.com/company/singhtheapp"
                            data-blast="bgColor"
                          >
                            <i className="icofont-linkedin" />
                          </a>
                        </li>

                        <li className="social-link">
                          <a
                            href="https://t.me/group_singhtheapp"
                            data-blast="bgColor"
                          >
                            <i className="icofont-telegram" />
                          </a>
                        </li>

                        {/* <li className="social-link">
                        <a href="#" data-blast="bgColor">
                          <i className="icofont-dribble" />
                        </a>
                      </li> */}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-links padding-top padding-bottom">
              <div className="container">
                <div className="row g-5 row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-5">
                  <div className="col">
                    <div className="footer-link-item">
                      <img src="assets/images/Singhlogo.png" alt="logo" />
                      <a
                        // href="#"
                        className="footer-link"
                        style={{ marginTop: "20px" }}
                      >
                        <h5> Singh domains are more than just web3 domains</h5>
                      </a>
                    </div>
                  </div>
                  <div className="col">
                    <div className="footer-link-item">
                      <h5>About</h5>
                      <ul className="footer-link-list">
                        <li>
                          <a
                            href="https://singhcoin.io"
                            target="_blank"
                            className="footer-link"
                          >
                            About
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://app.singhcoin.io"
                            target="_blank"
                            className="footer-link"
                          >
                            App
                          </a>
                        </li>
                        <li>
                          <a href="#" className="footer-link">
                            Premium DNS
                          </a>
                        </li>
                        <li>
                          <a href="#" className="footer-link">
                            Become a partner
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="col">
                    <div className="footer-link-item">
                      <h5>Download Singh Social Media app: </h5>
                      <a
                        href="https://play.google.com/store/apps/details?id=com.smartgenesis.singhcoin.singhcoin&utm_source=website&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                        target="_blank"
                        className="footer-link"
                        style={{ display: "flex", marginBottom: "20px" }}
                      >
                        <img src="https://singhcoin.io/img/Google%20.png" />
                      </a>

                      <a
                        href="https://apps.apple.com/in/app/singhcoin/id1634159563"
                        target="_blank"
                        className="footer-link"
                      >
                        <img src="https://singhcoin.io/img/App.png" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="container">
              <p className="text-center py-4 mb-0">
                © Singhcoin, All Right Reserved.
              </p>
              <p className="text-center py-4 mb-0">
                <a
                  href="https://singhcoin.io/privacypolicy.html"
                  target="_blank"
                >
                  Privacy Policy{" "}
                </a>{" "}
                |{" "}
                <a href="https://singhcoin.io/tnc.html" target="_blank">
                  {" "}
                  Terms &amp; Conditions
                </a>
              </p>
            </div>
          </div>
        </footer>
      )}

      {/* scrollToTop start here */}
      <a href="#" className="scrollToTop">
        <i className="icofont-stylish-up" />
      </a>
      {/* scrollToTop ending here */}
      {/* All Scripts */}
      <Script
        type="text/javascript"
        src="//cdn.cookie-script.com/s/5e71a1d889e7c51c0ceaa267315f3831.js"
      ></Script>
    </div>
  );
};

export default Layout;
