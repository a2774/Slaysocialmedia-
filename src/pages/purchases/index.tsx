import axiosInstance, { BASE_URL } from "@/axios/axiosInstance";
import Layout from "@/components/layout";
import {
  countries,
  formatDate,
  trimAddress,
  useTrimLength,
} from "@/utils/helpers";
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const Purchases = () => {
  const [purchasesList, setPurchasesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const trimLength = useTrimLength();

  useEffect(() => {
    const fetchDomains = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          `${BASE_URL}/freename/purchaseHistory`
        );
        setPurchasesList(response.data.history);
      } catch (e) {
        if (axios.isAxiosError(e)) {
          const errorMessage =
            e.response?.data?.message || "An unknown error occurred";
          toast.error(`${errorMessage}`, {
            position: "top-right",
            style: {
              top: "120px", // Adjusts the position slightly above the bottom
            },
          });
        } else {
          toast.error("An unexpected error occurred", {
            position: "top-right",
            style: {
              top: "120px", // Adjusts the position slightly above the bottom
            },
          });
        }
      }
      setIsLoading(false);
    };

    fetchDomains();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("profile");
    if (!token) {
      // router.push("/");
      window.location.assign("/login");
    }
  }, [router]);

  return (
    <Layout>
      <section className="banner-section Main-4">
        <div className="container">
          <div
            className="banner-wrapper"
            style={{
              paddingTop: "150px",
            }}
          >
            <Box sx={{ padding: 2 }}>
              <Typography variant="h4" gutterBottom>
                My Purchases
              </Typography>
              <List>
                {isLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress />
                  </div>
                ) : purchasesList.length > 0 ? (
                  purchasesList.map((purchase: any, index: number) => (
                    <div className="section-wrapper" key={index}>
                      <div className="blog-wrapper">
                        <div className="row  gx-4 gy-2">
                          <div className="col-lg-12 col-sm-12">
                            <div className="nft-item home-4 blog-item">
                              <div className="nft-inner">
                                <div className="nft-content">
                                  <div className="author-details">
                                    <h4>
                                      {purchase.zones.map(
                                        (i: any, index: number) => {
                                          return (
                                            <div
                                              key={index}
                                              style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                              }}
                                            >
                                              <div>
                                                <Tooltip
                                                  title={i.name}
                                                  arrow
                                                  placement="top-start"
                                                >
                                                  <h4>
                                                    <a>
                                                      {trimAddress(
                                                        i.name,
                                                        trimLength
                                                      )}
                                                    </a>
                                                  </h4>
                                                </Tooltip>
                                              </div>
                                              <div style={{ color: "#00EDC5" }}>
                                                ${i.amount}
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </h4>
                                    <div className="meta-info">
                                      <p>
                                        Price:{" "}
                                        <span
                                          style={{
                                            color: "#00EDC5",
                                          }}
                                        >
                                          ${purchase.totalCost}
                                        </span>
                                      </p>
                                      <p>
                                        <span>
                                          <i
                                            className="icofont-ui-calendar"
                                            data-blast="color"
                                          ></i>
                                        </span>
                                        {formatDate(purchase.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No purchases found" />
                  </ListItem>
                )}
                {/* {purchasesList.length > 0 ? (
                  purchasesList.map((purchase: any, index: number) => (
                    <div className="section-wrapper">
                      <div className="blog-wrapper">
                        <div className="row  gx-4 gy-2">
                          <div className="col-lg-4 col-sm-6">
                            <div className="nft-item home-4 blog-item">
                              <div className="nft-inner">
                                <div className="nft-content">
                                  <div className="author-details">
                                    <h4>
                                      {purchase.zones.map((i: any) => {
                                        return (
                                          <div
                                            style={{
                                              display: "flex",
                                              justifyContent: "space-between",
                                            }}
                                          >
                                            <div>{i.name}</div>
                                            <div style={{ color: "#00EDC5" }}>
                                              ${i.amount}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </h4>
                                    <div className="meta-info">
                                      <p>
                                        Price:{" "}
                                        <span
                                          style={{
                                            color: "#00EDC5",
                                          }}
                                        >
                                          ${purchase.totalCost}
                                        </span>
                                      </p>
                                      <p>
                                        <span>
                                          <i
                                            className="icofont-ui-calendar"
                                            data-blast="color"
                                          ></i>
                                        </span>
                                        {formatDate(purchase.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No purchases found" />
                  </ListItem>
                )} */}
              </List>
            </Box>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Purchases;
