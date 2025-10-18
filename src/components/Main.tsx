/* eslint-disable @next/next/no-img-element */
import React from "react";
import styles from "../assets/common-styles.module.css";
import Image from "next/image";
import StackedCards from "./stackedCards";
import { ButtonGroup, Button } from "@mui/material";
import { handleScrollToTop } from "@/utils/helpers";

const Main = ({
  handleSubmit,
  searchString,
  setSearchString,
  handleInputChange,
}: any) => {
  const handleMetaverseClick = () => {
    setSearchString(".metaverse");
    handleSubmit(".metaverse");
    handleScrollToTop();
  };

  const handleUsaClick = () => {
    setSearchString(".usa");
    handleSubmit(".usa");
    handleScrollToTop();
  };

  const handleGamingClick = () => {
    setSearchString(".gaming");
    handleSubmit(".gaming");
    handleScrollToTop();
  };

  const handleSinghClick = () => {
    setSearchString(".singh");
    handleSubmit(".singh");
    handleScrollToTop();
  };

  return (
    <div>
      <section
        className="banner-section Main-4"
        style={{ backgroundImage: "url(assets/images/banner/bg-4.jpg)" }}
      >
        <div className="container">
          <div
            className="banner-wrapper"
            style={{
              paddingTop: "100px",
            }}
          >
            <div className="row align-items-center g-5">
              <div className="col-lg-7">
                <div className="banner-content">
                  <h1
                    style={{
                      padding: "48px",
                    }}
                  >
                    <span className="theme-color-4"> Get Your Web3 </span>
                    Domains and TLDs
                    <span className="theme-color-4">
                      <br />
                      with Zero Renewal Fees
                    </span>
                  </h1>
                  <div
                    className="banner-btns d-flex flex-wrap"
                    style={{
                      paddingLeft: "48px",
                    }}
                  >
                    <a data-blast="bgColor" className="default-btn move-top">
                      <span>TLD</span>
                    </a>
                    <a
                      className="default-btn move-right"
                      style={{ background: "#f3a735" }}
                    >
                      {" "}
                      <span>SLD</span>{" "}
                    </a>
                    <a className="default-btn move-left">
                      <span>ALL</span>{" "}
                    </a>
                  </div>
                  <footer className="footer-section style-4">
                    <div className="footer-top">
                      <div className="footer-newsletter">
                        <div className="container">
                          <div className="row g-4 align-items-center justify-content-center">
                            <div className="col-lg-12">
                              <div className="newsletter-part">
                                {/* <div className="ft-header">
                            <h4>Get The Latest Rarible Updates</h4>
                          </div> */}
                                <form onSubmit={handleSubmit}>
                                  <input
                                    // type="search"
                                    // placeholder="Search here..."
                                    type="search"
                                    placeholder="Search your Favourite Domain..."
                                    value={searchString}
                                    onChange={handleInputChange}
                                    required
                                  />
                                  <button type="submit" data-blast="bgColor">
                                    Search
                                  </button>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </footer>
                </div>
              </div>

              <div
                className="col-lg-4"
                style={{
                  marginTop: 0,
                }}
              >
                <div className="">
                  <div className=" ">
                    <div className="">
                      <div className="">
                        <div className="nft-item home-4">
                          <div className="">
                            <div className="nft-item-top d-flex justify-content-between align-items-center">
                              <div className="author-part">
                                <ul className="author-list d-flex">
                                  <li className="single-author d-flex align-items-center"></li>
                                </ul>
                              </div>
                            </div>

                            <div className="nft-item-bottom">
                              <div className="nft-thumb">
                                {/* <img
                                  loading="lazy"
                                  src="https://freename.io/assets/img/home/illustration_home.png"
                                  alt="nft-img"
                                /> */}
                                <StackedCards />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ===============//banner section end here \\================= */}

      {/* SPONSORED */}
      <section className="category-section padding-top padding-bottom">
        <div className="container">
          <div className="section-header style-4">
            <div className="header-shape">
              <span />
            </div>
            <h3>SPONSORED</h3>
          </div>
          <div
            className="section-wrapper"
            style={{
              border: "1px dashed",
              borderRadius: "24px",
              backgroundColor: `#F3A735`,
            }}
          >
            <div
              className="responsive-container"
              // style={{
              //   display: "flex",
              //   padding: "10px",
              //   flexDirection: window.innerWidth >= 768 ? "row" : "column",
              // }}
            >
              <div
                // className="col-lg-3"
                // style={{
                //   display: "flex",
                //   width: "25%",
                //   flexDirection: "column",
                //   borderRadius: "8px",
                //   // height: "300px",
                //   backgroundColor: "black",

                //   margin: "6px",
                // }}
                className="responsive-card"
                onClick={handleMetaverseClick}
                style={{
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    paddingTop: "6px",
                  }}

                  // style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "24px",
                      height: "24px",
                    }}
                  >
                    <img src="assets/images/CROWN.jpg" alt="wallet-img" />
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      display: "flex",
                      paddingLeft: "4px",
                    }}
                  >
                    SPONSORED
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "24px",
                    // padding: "36px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    .metaverse
                  </div>
                  <div>SLDs starting at:</div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    $ 5.00
                  </div>
                </div>
              </div>
              <div
                // className="col-lg-3"
                // style={{
                //   display: "flex",
                //   width: "25%",

                //   flexDirection: "column",
                //   borderRadius: "8px",
                //   // height: "300px",
                //   backgroundColor: "black",
                //   // padding: "24px",
                //   margin: "6px",
                // }}
                className="responsive-card"
                onClick={handleUsaClick}
                style={{
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    paddingTop: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "24px",
                      height: "24px",
                    }}
                  >
                    <img src="assets/images/CROWN.jpg" alt="wallet-img" />
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      display: "flex",
                      paddingLeft: "4px",
                    }}
                  >
                    SPONSORED
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "24px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    .usa
                  </div>
                  <div>SLDs starting at:</div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    $ 5.00
                  </div>
                </div>
              </div>
              <div
                // className="col-lg-3"
                // style={{
                //   display: "flex",
                //   width: "25%",
                //   flexDirection: "column",
                //   borderRadius: "8px",

                //   backgroundColor: "black",

                //   margin: "6px",
                // }}
                className="responsive-card"
                onClick={handleGamingClick}
                style={{
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    paddingTop: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "24px",
                      height: "24px",
                    }}
                  >
                    <img src="assets/images/CROWN.jpg" alt="wallet-img" />
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      display: "flex",
                      paddingLeft: "4px",
                    }}
                  >
                    SPONSORED
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "24px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    .gaming
                  </div>
                  <div>SLDs starting at:</div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    $ 5.00
                  </div>
                </div>
              </div>
              <div
                // className="col-lg-3"
                // style={{
                //   display: "flex",
                //   width: "25%",
                //   flexDirection: "column",
                //   borderRadius: "8px",
                //   // height: "300px",
                //   backgroundColor: "black",
                //   // padding: "24px",
                //   margin: "6px",
                // }}
                className="responsive-card"
                onClick={handleSinghClick}
                style={{
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    paddingTop: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: "24px",
                      height: "24px",
                    }}
                  >
                    <img src="assets/images/CROWN.jpg" alt="wallet-img" />
                  </div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 700,
                      display: "flex",
                      paddingLeft: "4px",
                    }}
                  >
                    SPONSORED
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "24px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    .singh
                  </div>
                  <div>SLDs starting at:</div>
                  <div
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    $ 5.00
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ==========wallet Section ends Here========== */}
      {/* ==========wallet Section start Here========== */}
      <section className="wallet-section padding-top padding-bottom">
        <div className="container">
          <div className="section-header style-4">
            <div className="header-shape">
              <span />
            </div>
            <h3>With Singh Domain You Can:</h3>
          </div>
          <div className="wallet-inner">
            <div className="row g-3">
              <div className="col-lg-6 col-sm-4 col-6">
                <div className="wallet-item Main-4">
                  <div className="wallet-item-inner text-center">
                    <div className="wallet-thumb">
                      {/* <a href="#">
                        <img
                          src="assets/images/wallet/06.png"
                          alt="wallet-img"
                        />
                      </a> */}
                    </div>
                    <div className="wallet-content">
                      <h5>BE A REGISTRAR</h5>
                      <p>
                        Take charge by managing and registering your own web3
                        domains.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-sm-4 col-6">
                <div className="wallet-item Main-4">
                  <div className="wallet-item-inner text-center">
                    <div className="wallet-thumb">
                      {/* <a href="#">
                        <img
                          src="assets/images/wallet/07.png"
                          alt="wallet-img"
                        />
                      </a> */}
                    </div>
                    <div className="wallet-content">
                      <h5>
                        <a>MINT WEB3 TLDS</a>
                      </h5>
                      <p>
                        Mint your own TLDs and sell them on the marketplace.{" "}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-sm-4 col-6">
                <div className="wallet-item Main-4">
                  <div className="wallet-item-inner text-center">
                    <div className="wallet-thumb">
                      {/* <a href="#">
                        <img
                          src="assets/images/wallet/08.png"
                          alt="wallet-img"
                        />
                      </a> */}
                    </div>
                    <div className="wallet-content">
                      <h5>
                        <a>OWN YOUR DIGITAL IDENTITY</a>
                      </h5>
                      <p>Secure your unique presence in the digital world.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-sm-4 col-6">
                <div className="wallet-item Main-4">
                  <div className="wallet-item-inner text-center">
                    <div className="wallet-thumb">
                      {/* <a href="#">
                        <img
                          src="assets/images/wallet/01.png"
                          alt="wallet-img"
                        />
                      </a> */}
                    </div>
                    <div className="wallet-content">
                      <h5>
                        <a>CHAT WITH WEB3 EMAILS</a>
                      </h5>
                      <p>
                        Enjoy secure and efficient communication with
                        web3-enabled emails.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-sm-4 col-6">
                <div className="wallet-item Main-4">
                  <div className="wallet-item-inner text-center">
                    <div className="wallet-thumb">
                      {/* <a href="#">
                        <img
                          src="assets/images/wallet/03.png"
                          alt="wallet-img"
                        />
                      </a> */}
                    </div>
                    <div className="wallet-content">
                      <h5>
                        <a>NAME YOUR WALLET</a>
                      </h5>
                      <p>
                        Personalize your cryptocurrency wallet with a
                        distinctive web3 domain.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-sm-4 col-6">
                <div className="wallet-item Main-4">
                  <div className="wallet-item-inner text-center">
                    <div className="wallet-thumb">
                      {/* <a href="#">
                        <img
                          src="assets/images/wallet/05.png"
                          alt="wallet-img"
                        />
                      </a> */}
                    </div>
                    <div className="wallet-content">
                      <h5>
                        <a>SURF THE INTERNET</a>
                      </h5>
                      <p>Experience smooth browsing with web3-enabled DNS.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ==========wallet Section ends Here========== */}
      {/* ===============//auction section start here \\================= */}

      {/* ==========wallet Section ends Here========== */}
      {/* ==========wallet Section start Here========== */}
      <section className="wallet-section padding-top padding-bottom">
        <div className="container">
          <div className="section-header style-4">
            <div className="header-shape">
              <span></span>
            </div>
            <h3>Available Mint Options in Future:</h3>
          </div>

          <div className="wallet-inner">
            <div className="row g-3">
              <div className="col-lg-2 col-sm-4 col-6">
                <div className="wallet-item home-4">
                  <div className="wallet-item-inner text-center">
                    <div className="wallet-thumb">
                      <img
                        src={"assets/images/aurora.jpg"}
                        alt="Card QR"
                        style={{
                          width: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div className="wallet-content">
                      <h5>
                        <a href="#">Aurora</a>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-sm-4 col-6">
                <div className="wallet-item home-4">
                  <div className="wallet-item-inner text-center">
                    <div className="wallet-thumb">
                      <img
                        src={"assets/images/BSC.png"}
                        alt="Binanace Smart Chain"
                        style={{
                          width: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div className="wallet-content">
                      <h5>
                        <a href="#">Binance</a>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-sm-4 col-6">
                <div className="wallet-item home-4">
                  <div className="wallet-item-inner text-center">
                    <div className="wallet-thumb">
                      <img
                        src={"assets/images/polygon.jpg"}
                        alt="Card QR"
                        style={{
                          width: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div className="wallet-content">
                      <h5>
                        <a href="#">Polygon</a>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-sm-4 col-6">
                <div className="wallet-item home-4">
                  <div className="wallet-item-inner text-center">
                    <div className="wallet-thumb">
                      <img
                        src={"assets/images/solana.jpg"}
                        alt="Card QR"
                        style={{
                          width: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                    <div className="wallet-content">
                      <h5>
                        <a href="#">SOLANA</a>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-sm-4 col-6">
                <div className="wallet-item home-4">
                  <div className="wallet-item-inner text-center">
                    <div className="wallet-thumb">
                      <a href="#">
                        <img
                          src={"assets/images/base.png"}
                          alt="Card QR"
                          style={{
                            width: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                    </div>
                    <div className="wallet-content">
                      <h5>
                        <a href="#">BASE</a>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-2 col-sm-4 col-6">
                <div className="wallet-item home-4">
                  <div className="wallet-item-inner text-center">
                    <div className="wallet-thumb">
                      <a href="#">
                        <img
                          src={"assets/images/NEAR.jpg"}
                          alt="Card QR"
                          style={{
                            width: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </a>
                    </div>
                    <div className="wallet-content">
                      <h5>
                        <a href="#">NEAR</a>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Main;
