import axiosInstance, { BASE_URL } from "@/axios/axiosInstance";
import Layout from "@/components/layout";
import {
  onGlobalAddToCart,
  onGlobalRemoveFromCart,
} from "@/store/reducers/userSlice";
import { getCartFromLocalStorage, saveCartToLocalStorage } from "@/utils/cart";
import {
  calculateOriginalPrice,
  countries,
  formatDate,
  primaryColor,
  trimAddress,
} from "@/utils/helpers";
import {
  Box,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

const SuggestedDomainsTlds = ({
  isLoading,
  purchasesList,
  onAddToCart,
}: any) => {
  //   const [purchasesList, setPurchasesList] = useState([]);
  //   const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  //   useEffect(() => {
  //     const fetchDomains = async () => {
  //       setIsLoading(true);
  //       try {
  //         const response = await axiosInstance.get(
  //           `${BASE_URL}/freename/purchaseHistory`
  //         );
  //         setPurchasesList(response.data.history);
  //       } catch (e) {
  //         if (axios.isAxiosError(e)) {
  //           const errorMessage =
  //             e.response?.data?.message || "An unknown error occurred";
  //           toast.error(`${errorMessage}`, {
  //             position: "top-right",
  //             style: {
  //               top: "120px", // Adjusts the position slightly above the bottom
  //             },
  //           });
  //         } else {
  //           toast.error("An unexpected error occurred", {
  //             position: "top-right",
  //             style: {
  //               top: "120px", // Adjusts the position slightly above the bottom
  //             },
  //           });
  //         }
  //       }
  //       setIsLoading(false);
  //     };

  //     fetchDomains();
  //   }, []);

  //   useEffect(() => {
  //     const token = localStorage.getItem("profile");
  //     if (!token) {
  //       // router.push("/");
  //       window.location.assign("/login");
  //     }
  //   }, [router]);

  const [cartItems, setCartItems] = useState<any>(getCartFromLocalStorage());

  const { cart: globalCart } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  const addToCartHandler = useCallback(
    async (item: any) => {
      if (isItemInCart(item)) {
        // Remove from cart
        const updatedCart = getCartFromLocalStorage().filter(
          (cartItem: any) => cartItem.name !== item.name
        );

        setCartItems(updatedCart);

        saveCartToLocalStorage(updatedCart);
        await dispatch(onGlobalRemoveFromCart(item));
        // toast.info(`${item.name} removed from cart!`, {
        //   position: "bottom-right",
        // });
      } else {
        // Add to cart
        const updatedCart = [...getCartFromLocalStorage(), item];
        setCartItems(updatedCart);
        saveCartToLocalStorage(updatedCart);
        onAddToCart(item);
        await dispatch(onGlobalAddToCart(item));
        toast.success(`${item.name} added to cart!`, {
          position: "bottom-right",
          style: {
            bottom: "80px",
            // zIndex: 99999,
          },
        });
      }
    },
    [cartItems, onAddToCart, globalCart]
  );

  const isItemInCart = useCallback(
    (item: any) => {
      return globalCart.some((cartItem: any) => cartItem.name === item.name);
    },
    [globalCart]
  );

  return (
    <div className="">
      <div
      // className="banner-wrapper"
      // style={{
      //   paddingTop: "150px",
      // }}
      >
        <Box sx={{}}>
          {/* <Typography variant="h4" gutterBottom>
            My Purchases
          </Typography> */}
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
            ) : purchasesList?.elements.length > 0 ? (
              purchasesList?.elements?.map((purchase: any, index: number) => (
                <div className="section-wrapper" key={index}>
                  <div className="blog-wrapper">
                    <div className="row  gx-4 gy-2">
                      <div className="col-lg-12 col-sm-12">
                        <div className="nft-item home-4 blog-item">
                          <div className="nft-inner">
                            <div className="nft-content">
                              <div className="author-details">
                                <div className="nft-item-top d-flex justify-content-between align-items-center">
                                  <div className="author-part">
                                    <ul className="author-list d-flex">
                                      <li className="single-author"></li>
                                      <li className="single-author d-flex align-items-center">
                                        <h6>
                                          <a
                                            style={
                                              purchase.availabilityStatus ===
                                              "AVAILABLE"
                                                ? {
                                                    color: "#00EDC5",
                                                  }
                                                : purchase.availabilityStatus ===
                                                  "PROTECTED"
                                                ? {
                                                    color: "orange",
                                                  }
                                                : {
                                                    color: "red",
                                                  }
                                            }
                                          >
                                            {purchase.availabilityStatus}
                                          </a>
                                        </h6>
                                        {purchase.availabilityStatus ===
                                          "AVAILABLE" ||
                                          (purchase.availabilityStatus ===
                                            "PROTECTED" && (
                                            <div>
                                              <Button
                                                variant="contained"
                                                type="submit"
                                                disabled
                                                data-blast="bgColor"
                                                style={{
                                                  backgroundColor: `#00EDC5`,
                                                  fontWeight: 700,
                                                  borderRadius: "24px",
                                                  color: "#fff",
                                                }}
                                              >
                                                SAVE 50%
                                              </Button>
                                            </div>
                                          ))}
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                <div className="nft-item-bottom">
                                  <div className="nft-content">
                                    <h4>
                                      <a
                                        style={{
                                          overflow: "hidden",
                                          textOverflow: "ellipsis",
                                          whiteSpace: "nowrap",
                                          width: "100%",
                                        }}
                                      >
                                        {purchase.name}
                                      </a>
                                    </h4>
                                    <div
                                      className="price-like d-md-flex d-block justify-content-between align-items-center"
                                      style={{
                                        paddingBottom: "12px",
                                      }}
                                    >
                                      {purchase.price?.valueFormatted && (
                                        <div
                                          style={{
                                            display: "flex",
                                          }}
                                        >
                                          <p className="nft-price">
                                            <span className="yellow-color">
                                              $
                                              {calculateOriginalPrice(
                                                purchase.price?.valueFormatted
                                              )}
                                            </span>
                                          </p>

                                          <div
                                            className="nft-price"
                                            style={{
                                              paddingLeft: "12px",
                                              fontWeight: 500,
                                              textDecoration: "line-through",
                                              color: "grey",
                                            }}
                                          >
                                            ${purchase.price?.valueFormatted}
                                          </div>
                                        </div>
                                      )}

                                      {purchase.availabilityStatus ===
                                        "AVAILABLE" ||
                                        (purchase.availabilityStatus ===
                                          "PROTECTED" && (
                                          <Button
                                            className="footer-section style-4"
                                            variant="contained"
                                            style={{
                                              backgroundColor: `${primaryColor}`,
                                              color: "black",
                                              fontWeight: 700,
                                            }}
                                            onClick={() =>
                                              addToCartHandler(purchase)
                                            }
                                            startIcon={<AddShoppingCartIcon />}
                                          >
                                            {isItemInCart(purchase)
                                              ? "On Cart"
                                              : "Add to Cart"}
                                          </Button>
                                        ))}
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
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No Domains or TLDs found" />
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
  );
};

export default SuggestedDomainsTlds;
