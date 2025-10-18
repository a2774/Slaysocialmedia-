import React, { useCallback, useEffect, useState } from "react";
import styles from "../assets/common-styles.module.css";
import { Button } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { getCartFromLocalStorage, saveCartToLocalStorage } from "@/utils/cart";
import { calculateOriginalPrice, primaryColor } from "@/utils/helpers";
import {
  onGlobalAddToCart,
  onGlobalRemoveFromCart,
} from "@/store/reducers/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

interface ActivityItem {
  id: number;
  title: string;
  description: string;
  user: string;
  date: string;
  imageUrl: string;
}

interface ResultsListProps {
  items: any; // ActivityItem[]
  onAddToCart: (item: any) => void; // ActivityItem[]
}

const ResultsList = ({ items, onAddToCart }: ResultsListProps) => {
  const [cartItems, setCartItems] = useState<any>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch cart items from local storage when component mounts
    setCartItems(getCartFromLocalStorage());
  }, []);

  const { cart: globalCart } = useSelector((state: any) => state.user);

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
        //   style: {
        //     bottom: "50px", // Adjusts the position slightly above the bottom
        //   },
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
          },
        });
      }
    },
    [cartItems, onAddToCart, globalCart, dispatch]
  );

  const isItemInCart = useCallback(
    (item: any) => {
      return globalCart.some((cartItem: any) => cartItem.name === item.name);
    },
    [globalCart]
  );

  return (
    <div className="activity-wrapper">
      <div className="row gy-3">
        <div className={`${styles.textContainer}`}>Results</div>
        {items.map((item: any) => (
          <div className="col-12" key={item.name}>
            <div
              className="nft-item home-4"
              style={{
                padding: "4px",
              }}
            >
              <div className="nft-inner">
                <div className="nft-item-top d-flex justify-content-between align-items-center">
                  <div className="author-part">
                    <ul className="author-list d-flex">
                      <li className="single-author"></li>
                      <li className="single-author d-flex align-items-center">
                        <h6>
                          <a
                            style={
                              item.availabilityStatus === "AVAILABLE"
                                ? {
                                    color: "#00EDC5",
                                  }
                                : {
                                    color: "red",
                                  }
                            }
                          >
                            {item.availabilityStatus}
                          </a>
                        </h6>
                        {item.availabilityStatus === "AVAILABLE" && (
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
                        )}
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
                        {item.name}
                      </a>
                    </h4>
                    <div
                      className="price-like d-md-flex d-block justify-content-between align-items-center"
                      style={{
                        paddingBottom: "12px",
                      }}
                    >
                      {item.price?.valueFormatted && (
                        <div
                          style={{
                            display: "flex",
                          }}
                        >
                          <p className="nft-price">
                            <span className="yellow-color">
                              $
                              {calculateOriginalPrice(
                                item.price?.valueFormatted
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
                            ${item.price?.valueFormatted}
                          </div>
                        </div>
                      )}

                      {item.availabilityStatus === "AVAILABLE" && (
                        <Button
                          className="footer-section style-4"
                          variant="contained"
                          style={{
                            backgroundColor: `${primaryColor}`,
                            color: "black",
                            fontWeight: 700,
                          }}
                          onClick={() => addToCartHandler(item)}
                          startIcon={<AddShoppingCartIcon />}
                        >
                          {isItemInCart(item) ? "On Cart" : "Add to Cart"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsList;
