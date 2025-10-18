import axiosInstance, { BASE_URL } from "@/axios/axiosInstance";
import Layout from "@/components/layout";
import TablePaginationCustom from "@/components/Pagination";
import { getProfileFromLocalStorage } from "@/utils/cart";
import { trimAddress, useTrimLength } from "@/utils/helpers";
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Incomes() {
  const [isLoading, setIsLoading] = useState(false);
  const [incomesList, setIncomesList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Number of items per page

  const [searchTerm, setSearchTerm] = useState(""); // Track search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Debounced search term

  const handlePageChange = (event: any, newPage: any) => {
    console.log("new Page", newPage);
    setCurrentPage(newPage + 1);
  };

  const handleRowsPerPageChange = (event: any) => {
    setRowsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update search term as user types
  };

  const fetchIncomes = async (
    page: number,
    limit: number,
    searchQuery = ""
  ) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/freename/income?userId=${
          getProfileFromLocalStorage()?._id
        }&page=${page}&limit=${limit}&domainName=${searchQuery}`
      );
      console.log("response", response);
      setIncomesList(response.data.data);
      setTotalPages(response.data.totalRecords);

      setCurrentPage(response.data.currentPage);
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
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("profile");
    if (!token) {
      // router.push("/");
      window.location.assign("/login");
    }
  }, [router]);

  useEffect(() => {
    if (currentPage === 0) {
      fetchIncomes(1, rowsPerPage, debouncedSearchTerm);
    } else fetchIncomes(currentPage, rowsPerPage, debouncedSearchTerm);
  }, [currentPage, rowsPerPage, debouncedSearchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Adjust delay as needed

    return () => {
      clearTimeout(handler); // Cleanup the timeout if searchTerm changes before 500ms
    };
  }, [searchTerm]);

  const trimLength = useTrimLength();

  return (
    <Layout>
      <section className="banner-section Main-4">
        <div className="container">
          <div className="banner-wrapper" style={{ paddingTop: "150px" }}>
            <Box sx={{ padding: 2 }}>
              <Typography variant="h4" gutterBottom>
                My Incomes
              </Typography>

              {/* Search UI */}
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  label="Search here..."
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={handleSearchChange} // Handle search input change
                  placeholder="Enter domain name"
                  sx={{
                    input: { color: "#fff" },
                    backgroundColor: "#333",

                    label: { color: "#fff" }, // Label color
                  }} // Adjust styling as needed
                />
              </Box>
              <List>
                {isLoading ? (
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <CircularProgress />
                  </div>
                ) : incomesList.length > 0 ? (
                  incomesList.map((income: any, index: number) => (
                    <div
                      className="activity-wrapper"
                      key={index}
                      style={{ paddingTop: "36px" }}
                    >
                      <div className="row gy-3">
                        <div className="col-12">
                          <div className="activity-item">
                            <div className="lab-inner d-flex flex-wrap align-items-center p-3 p-md-4">
                              {/* Tooltip for full domain name */}
                              <div style={{ flexGrow: 1 }}>
                                <div
                                  style={{
                                    display: "flex",
                                    textAlign: "center",
                                    paddingBottom: "12px",
                                  }}
                                >
                                  <div
                                    style={{
                                      fontWeight: 700,
                                      paddingRight: "4px",
                                    }}
                                  >
                                    Earnings:
                                  </div>

                                  <div>${income?.amount.toFixed(2)}</div>
                                </div>
                                <h4>SECOND LEVEL DOMAIN:</h4>
                                <Tooltip
                                  title={income?.domainId?.zoneName}
                                  arrow
                                  // placement="bottom-start"
                                >
                                  <div
                                    style={{
                                      paddingTop: "12px",
                                    }}
                                  >
                                    Bought Domain:{" "}
                                    <a style={{ fontWeight: 700 }}>
                                      {trimAddress(
                                        income?.domainId?.zoneName,
                                        trimLength
                                      )}
                                    </a>
                                  </div>
                                </Tooltip>
                                <div
                                  style={{
                                    display: "flex",
                                    paddingTop: "8px",
                                  }}
                                >
                                  <p className="mb-2">
                                    Status:
                                    <span
                                      style={
                                        income?.domainId?.status === "PENDING"
                                          ? { color: "red" }
                                          : { color: "#00EDC5" }
                                      }
                                    >
                                      {" "}
                                      {income?.domainId?.status}
                                    </span>
                                  </p>

                                  <p style={{ paddingLeft: "24px" }}>
                                    Price:{" "}
                                    <span style={{ color: "#00EDC5" }}>
                                      ${income?.domainId?.amount}
                                    </span>
                                  </p>
                                </div>
                                <h4>TLD details:</h4>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  TLD:{" "}
                                  <div
                                    style={{
                                      padding: "6px",
                                      color: "#00EDC5",
                                    }}
                                  >
                                    {income?.tldId?.zoneName}

                                    {/* <CalendarMonth /> */}
                                  </div>{" "}
                                  <p style={{ paddingLeft: "24px", margin: 0 }}>
                                    Price:{" "}
                                    <span style={{ color: "#00EDC5" }}>
                                      ${income?.tldId?.amount}
                                    </span>
                                  </p>
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
                    <ListItemText primary="No domains found" />
                  </ListItem>
                )}
              </List>

              <TablePaginationCustom
                count={totalPages}
                page={currentPage - 1}
                rowsPerPage={rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                // backIconButtonProps={{ disabled: currentPage === 1 }}
                // dense
              />
            </Box>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Incomes;
