// pages/DomainListPage.tsx

import { useEffect, useState } from "react";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import axiosInstance, { BASE_URL } from "@/axios/axiosInstance";
import { toast } from "react-toastify";
import Header from "@/components/Header"; // Adjust the path as needed
import axios from "axios";

//

const DomainList = () => {
  const [domainsList, setDomainsList] = useState([]);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const response = await axiosInstance.get(
          `${BASE_URL}/freename/domainsOwned`
        );
        setDomainsList(response.data.domains);
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
    };

    fetchDomains();
  }, []);

  return (
    <div>
      <section className="banner-section Main-4">
        <div className="container">
          <div
            className="banner-wrapper"
            style={{
              paddingTop: "128px",
            }}
          >
            <Box sx={{ padding: 2 }}>
              <Typography variant="h4" gutterBottom>
                My Domains
              </Typography>
              <List>
                {domainsList.length > 0 ? (
                  domainsList.map((domain: any, index: number) => (
                    <ListItem key={index}>
                      <div
                        className="wallet-inner"
                        style={{
                          width: "100%",
                        }}
                      >
                        <div className="row g-3">
                          <div className="col-12">
                            <div className="wallet-item Main-4">
                              <div className="wallet-item-inner ">
                                <div className="wallet-thumb"></div>
                                <div className="wallet-content">
                                  <h5>{domain.name}</h5>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <ListItemText primary={domain.name} /> */}
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No domains found" />
                  </ListItem>
                )}
              </List>
            </Box>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DomainList;
