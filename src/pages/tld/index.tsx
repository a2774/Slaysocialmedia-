import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Tooltip,
  Button,
  TextField,
} from "@mui/material";
import axiosInstance, { BASE_URL } from "@/axios/axiosInstance";
import { toast } from "react-toastify";
import axios from "axios";
import Layout from "@/components/layout";
import {
  formatDate,
  formatTime,
  trimAddress,
  useTrimLength,
} from "@/utils/helpers";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import {
  onClearGlobalCart,
  onGlobalRemoveFromCart,
} from "@/store/reducers/userSlice";
import { CalendarMonth } from "@mui/icons-material";
import TablePaginationCustom from "@/components/Pagination";

const TldList = () => {
  const [domainsList, setDomainsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Number of items per page

  const [searchTerm, setSearchTerm] = useState(""); // Track search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // Debounced search term

  const fetchTlds = async (page: number, limit: number, searchQuery = "") => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `${BASE_URL}/freename/domainsOwned?type=TLD&page=${page}&limit=${limit}&name=${searchQuery}`
        // `${BASE_URL}/freename/domainsOwned?type=TLD`
      );
      setDomainsList(response.data.domains);
      setTotalPages(response.data.total);

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

  useEffect(() => {
    // Fetch domains when currentPage, limit, or debouncedSearchTerm changes
    // if (currentPage >= 1) {
    if (currentPage === 0) {
      fetchTlds(1, rowsPerPage, debouncedSearchTerm);
    } else fetchTlds(currentPage, rowsPerPage, debouncedSearchTerm);
    // }
  }, [currentPage, rowsPerPage, debouncedSearchTerm]);
  ///

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Adjust delay as needed

    return () => {
      clearTimeout(handler); // Cleanup the timeout if searchTerm changes before 500ms
    };
  }, [searchTerm]);

  const queryParams = useSearchParams();
  const [paymentLoader, setPaymentLoader] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const captureEvent = async (orderId: any) => {
    try {
      // if (finalamount > 0) {
      const response = await axiosInstance.post(
        `${BASE_URL}/freename/retrievePaymentIntent`,
        {
          orderId: orderId,
        }
      );
      console.log("captureEventPayment response", response);

      if (response.data) {
        setPaymentLoader(false);
        toast.success("Domain is successfully bought", {
          position: "top-right",
          style: {
            top: "120px", // Adjusts the position slightly above the bottom
          },
        });

        await dispatch(onClearGlobalCart());
        localStorage.removeItem("cart");
        localStorage.removeItem("discountPercentage");
        localStorage.removeItem("referralCoupon");

        // fetchDomains();

        if (router.query.token || router.query.PayerID) {
          // router.replace("/domain");
          fetchTlds(currentPage, rowsPerPage, debouncedSearchTerm);
          // fetchTlds();
        }
        // Swal.fire("", "Ticket is successfully bought", "success");
      }
      // }
    } catch (error) {
      setPaymentLoader(false);
      localStorage.removeItem("discountPercentage");
      localStorage.removeItem("referralCoupon");

      console.error("Payment failed:", error);
      // Swal.fire("", "Payment failed", "error");
      toast.error("Payment failed", {
        position: "top-right",
        style: {
          top: "120px", // Adjusts the position slightly above the bottom
        },
      });
    }
  };

  useEffect(() => {
    const token = queryParams.get("token");
    console.log("#token", token, queryParams);
    if (token) {
      setPaymentLoader(true);
      captureEvent(token);
    }
  }, [queryParams]);

  useEffect(() => {
    const token = localStorage.getItem("profile");
    if (!token) {
      // router.push("/");
      window.location.assign("/login");
    }
  }, [router]);

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

  const formatTimeWithTimezone = (dateInput: string | number | Date) => {
    // Convert to Date object if it's a string or number
    const date =
      typeof dateInput === "string" || typeof dateInput === "number"
        ? new Date(dateInput)
        : dateInput;

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      hour12: true, // for 12-hour format with AM/PM
      timeZoneName: "short",
    };

    // Format time with timezone abbreviation (e.g., "6:00 PM GMT")
    const formattedTime = new Intl.DateTimeFormat("en-US", options).format(
      date
    );

    // Get timezone offset (e.g., "+5:30" or "-4:00")
    const timezoneOffset = -date.getTimezoneOffset(); // in minutes
    const hoursOffset = Math.floor(Math.abs(timezoneOffset) / 60);
    const minutesOffset = Math.abs(timezoneOffset) % 60;
    const offsetSign = timezoneOffset >= 0 ? "+" : "-";
    const formattedOffset = `${offsetSign}${hoursOffset}:${minutesOffset
      .toString()
      .padStart(2, "0")}`;

    return `${formattedTime}`;
  };

  const trimLength = useTrimLength();
  return (
    <Layout>
      <section className="banner-section Main-4">
        <div className="container">
          <div className="banner-wrapper" style={{ paddingTop: "150px" }}>
            <Box sx={{ padding: 2 }}>
              <Typography variant="h4" gutterBottom>
                My TLDs
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
                ) : domainsList.length > 0 ? (
                  domainsList.map((domain: any, index: number) => (
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
                                <Tooltip
                                  title={domain.name}
                                  arrow
                                  placement="top-start"
                                >
                                  <h4>
                                    <a>
                                      {trimAddress(domain.name, trimLength)}
                                    </a>
                                  </h4>
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
                                        domain.status === "PENDING"
                                          ? { color: "red" }
                                          : { color: "#00EDC5" }
                                      }
                                    >
                                      {" "}
                                      {domain.status}
                                    </span>
                                  </p>

                                  <p style={{ paddingLeft: "24px" }}>
                                    Price:{" "}
                                    <span style={{ color: "#00EDC5" }}>
                                      ${domain.amount}
                                    </span>
                                  </p>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  At:{" "}
                                  <div
                                    style={{
                                      padding: "6px",
                                    }}
                                  >
                                    <CalendarMonth />
                                  </div>{" "}
                                  {formatDate(domain.timestamp)},{"  "}
                                  {formatTimeWithTimezone(domain.timestamp)}
                                  {/* {formatDate(domain.timestamp)},{"  "}
                                  {formatTime(domain.timestamp)} */}
                                </div>
                              </div>

                              {/* Manage DNS button */}
                              {/* <div>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => {
                                    router.push(
                                      `/manage/${domain.name}?uuid=${domain.zoneUUID}`
                                    );
                                  }}
                                >
                                  Manage DNS
                                </Button>
                              </div> */}
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

        {paymentLoader && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1300,
            }}
          >
            <CircularProgress color="secondary" />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Processing...
            </Typography>
          </Box>
        )}
      </section>
    </Layout>
  );
};

export default TldList;
