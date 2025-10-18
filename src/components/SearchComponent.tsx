import React, { useState } from "react";
import styles from "../assets/common-styles.module.css";
import ResultsList from "./Results";
import { TopTlds } from "./TopTlds";
import SuggestedTlds from "./SuggestedTlds";
import { CircularProgress } from "@mui/material";
import SuggestedDomainsTlds from "./SuggestedDomainsTlds";

const SearchComponent = ({
  handleSubmit,
  searchString,
  suggestedTlds,
  topTlds,
  handleInputChange,
  results,
  isLoading,
  searchResults,
  onAddToCart,
}: any) => {
  const [data, setData] = useState();
  const [loadingSearch, setLoadingSearch] = useState(false);

  // useEffect(() => {
  //   const apiUrl = `https://api.freename.io/searchbar/get-carousel-elements?searchString=${searchString}&tlds=metaverse%2Chodl%2Csatoshi`;

  //   const fetchFn = async () => {
  //     setLoadingSearch(true);
  //     try {
  //       const response = await axios.get(apiUrl);

  //       setData(response?.data?.data?.result?.[0].elements);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     } finally {
  //       setLoadingSearch(false);
  //     }
  //   };
  //   fetchFn();
  // }, [searchString]);
  //console.log("search", searchResults, results);
  return (
    <div>
      <section
        className="banner-section home-4"
        style={{ backgroundImage: "url(assets/images/banner/bg-4.jpg)" }}
      >
        <div className="container">
          <div className="banner-wrapper">
            <div className="row align-items-center g-5">
              <div className="col-lg-12">
                <div className="banner-content">
                  <footer className="footer-section style-4">
                    <div className="footer-top">
                      <div className="footer-newsletter">
                        <div className="">
                          <div className="row g-4 align-items-center justify-content-center">
                            <div className="col-lg-12">
                              <div className="newsletter-part">
                                <form onSubmit={handleSubmit}>
                                  <input
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
                                {isLoading ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      paddingTop: "48px",
                                    }}
                                  >
                                    <CircularProgress />
                                  </div>
                                ) : (
                                  <ResultsList
                                    items={searchResults}
                                    onAddToCart={onAddToCart}
                                  />
                                )}
                                <section className="wallet-section padding-top padding-bottom">
                                  <div
                                    className=""
                                    style={{
                                      position: "relative",
                                    }}
                                  >
                                    <div className="section-header style-4">
                                      <div className="header-shape">
                                        <span />
                                      </div>
                                      <h3>Top TLDs</h3>
                                    </div>
                                    <div>
                                      <div style={{}}>
                                        {isLoading ? (
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "center",
                                              paddingTop: "48px",
                                            }}
                                          >
                                            <CircularProgress />
                                          </div>
                                        ) : (
                                          <TopTlds
                                            autoplay={true}
                                            autoplaySpeed={3000}
                                            slideNum={3}
                                            data={topTlds}
                                            label={""}
                                            heading={""}
                                            subheading={""}
                                            onAddToCart={onAddToCart}
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                      }}
                                    >
                                      <h5>Royalties coming soon...</h5>
                                    </div>
                                  </div>
                                </section>
                              </div>
                            </div>

                            <div
                              style={{
                                padding: "12px",
                              }}
                            >
                              {/* <h4>Suggested Tlds</h4> */}

                              {/* <div className="header-shape">
                                  <span />
                                </div>
                                <h3>Suggested Domains+TLDs</h3> */}
                              <div className="section-header style-4">
                                <div className="header-shape">
                                  <span />
                                </div>
                                <h3>Suggested Domains + TLDs</h3>
                              </div>
                              <SuggestedDomainsTlds
                                isLoading={isLoading}
                                purchasesList={results?.[3]}
                                onAddToCart={onAddToCart}
                              />
                            </div>
                            <div
                              style={{
                                padding: "12px",
                              }}
                            >
                              {/* <h4>Suggested Tlds</h4> */}
                              <div className="section-header style-4">
                                <div className="header-shape">
                                  <span />
                                </div>
                                <h3>Suggested TLDs</h3>
                              </div>
                            </div>
                            {isLoading ? (
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  paddingTop: "48px",
                                }}
                              >
                                <CircularProgress />
                              </div>
                            ) : (
                              <SuggestedTlds
                                data={suggestedTlds}
                                searchString={searchString}
                                onAddToCart={onAddToCart}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchComponent;
