import Slider from "react-slick";
// Import css files
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { FullWidthBgImage } from "./FullWidthBgImage";
import styles from "../assets/common-styles.module.css";
import { FiArrowRightCircle, FiArrowLeftCircle } from "react-icons/fi";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

import { createRef, useCallback, useEffect, useRef, useState } from "react";
import { useResponsive } from "@/helpers/useResponsive";
import { Button } from "@mui/material";
import { getCartFromLocalStorage, saveCartToLocalStorage } from "@/utils/cart";
import { calculateOriginalPrice, primaryColor } from "@/utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  onGlobalAddToCart,
  onGlobalRemoveFromCart,
} from "@/store/reducers/userSlice";
import { toast } from "react-toastify";

export const TopTlds = ({
  data,
  label,
  heading,
  subheading,
  slideNum,
  autoplay,
  autoplaySpeed,
  onAddToCart,
}: any) => {
  const { screenType } = useResponsive();
  const sliderRef = useRef();
  const settings = {
    arrows: false,
    dots: true,
    swipeToSlide: true,
    infinite: true,
    // autoplay: autoplay,
    // autoplaySpeed: autoplaySpeed,
    slidesToShow: screenType === "MOBILE" ? 2 : slideNum,
    slidesToScroll: screenType === "MOBILE" ? 2 : slideNum,
  };

  const customeSlider: any = useRef();

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
    <>
      <div style={{ marginBottom: 20, marginLeft: 10 }}>
        <h2>{heading}</h2>
        <p>{subheading}</p>
      </div>
      <div>
        <div>
          {/* {screenType !== "MOBILE" && ( */}
          <div
            onClick={() => customeSlider.current.slickPrev()}
            className={styles.prev}
            style={{
              backgroundColor: "black",
            }}
          >
            <FiArrowLeftCircle style={{ fontSize: 24 }} />
          </div>

          <Slider {...settings} ref={customeSlider}>
            {data?.length > 0 &&
              data?.map((item: any, index: number) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div className="section-wrapper">
                    <div className="auction-holder">
                      <div className="swiper-wrapper">
                        <div className="swiper-slide">
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
                                        <a>Premium</a>
                                      </h6>
                                      <div>
                                        <Button
                                          variant="contained"
                                          // /  type="submit"
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
                                            {/* {item.price?.valueFormatted} */}
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
                                  </div>
                                  <Button
                                    variant="contained"
                                    style={{
                                      backgroundColor: `${primaryColor}`,
                                      color: "black",
                                      fontWeight: 700,
                                    }}
                                    onClick={() => addToCartHandler(item)}
                                    startIcon={<AddShoppingCartIcon />}
                                  >
                                    {isItemInCart(item)
                                      ? "On Cart"
                                      : "Add to Cart"}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Slider>

          <div
            onClick={() => customeSlider.current.slickNext()}
            className={styles.next}
            style={{
              backgroundColor: "black",
            }}
          >
            <FiArrowRightCircle style={{ fontSize: 24 }} />
          </div>
        </div>
      </div>
    </>
  );
};
