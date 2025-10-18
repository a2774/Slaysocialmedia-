import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Stack,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { getCartFromLocalStorage, saveCartToLocalStorage } from "@/utils/cart";
import {
  calculateOriginalPrice,
  primaryColor,
  trimAddress,
} from "@/utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import {
  onGlobalAddToCart,
  onGlobalRemoveFromCart,
} from "@/store/reducers/userSlice";
import { toast } from "react-toastify";

interface SuggestedTldsProps {
  data: any;
  searchString: string;
  onAddToCart: any;
}

const SuggestedTlds = ({
  data,
  searchString,
  onAddToCart,
}: SuggestedTldsProps) => {
  const [tlds, setTlds] = useState(data);
  const [cartItems, setCartItems] = useState<any>(getCartFromLocalStorage());
  const { cart: globalCart } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    setTlds(data);
  }, [data]);

  const addToCartHandler = useCallback(
    async (item: any) => {
      if (isItemInCart(item)) {
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
        const updatedCart = [...getCartFromLocalStorage(), item];
        setCartItems(updatedCart);
        saveCartToLocalStorage(updatedCart);
        onAddToCart(item);
        await dispatch(onGlobalAddToCart(item));
        toast.success(`${item.name} added to cart!`, {
          position: "bottom-right",
          style: {
            bottom: "80px", // Adjusts the position slightly above the bottom
          },
        });
      }
    },
    [cartItems, onAddToCart, globalCart]
  );

  const isItemInCart = useCallback(
    (item: any) =>
      globalCart.some((cartItem: any) => cartItem.name === item.name),
    [globalCart]
  );

  return (
    <div style={{ padding: "16px" }}>
      {/* <div
        className="nft-item home-4"
        style={{
          padding: "4px",
        }}
      >
        <div className="nft-inner">
          <div className="nft-item-top d-flex justify-content-between align-items-center"> */}
      <Grid container justifyContent="center" spacing={2}>
        {tlds?.map((item: any, index: number) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={5}
            lg={3}
            key={index}
            className="nft-item home-4"
            style={{
              marginBottom: 0,
            }}
          >
            <Card
              sx={{
                // minHeight: "250px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                backgroundColor: "black",
                border: "1px solid white",
                borderColor: "white",
              }}
              className="nft-inner"
            >
              {/* <CardContent>
                      <Typography variant="h5" component="div" gutterBottom>
                        {item.name}
                      </Typography>
                      {item.price?.valueFormatted && (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            sx={{ fontWeight: "bold", color: "#00EDC5" }}
                            variant="h6"
                          >
                            $
                            {calculateOriginalPrice(item.price?.valueFormatted)}
                          </Typography>
                          <Typography
                            sx={{
                              marginLeft: 2,
                              textDecoration: "line-through",
                              color: "gray",
                            }}
                            variant="body2"
                          >
                            ${item.price?.valueFormatted}
                          </Typography>
                        </div>
                      )}
                    </CardContent> */}
              <div>
                <Typography
                  variant="h5"
                  component="div"
                  gutterBottom
                  style={{
                    color: "#fff",
                  }}
                >
                  {item.name}
                </Typography>
                {item.price?.valueFormatted && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      // justifyContent: "center",
                    }}
                  >
                    {/* Discounted Price */}
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: "#00EDC5",
                        marginRight: 2,
                      }}
                      variant="h6"
                    >
                      ${calculateOriginalPrice(item.price?.valueFormatted)}
                    </Typography>

                    {/* Original Price */}
                    <Typography
                      sx={{
                        textDecoration: "line-through",
                        color: "gray",
                        fontSize: "0.875rem",
                      }}
                      variant="h6"
                    >
                      ${item.price?.valueFormatted}
                    </Typography>
                  </div>
                )}
              </div>

              <CardActions
                sx={{ justifyContent: "center", paddingBottom: "16px" }}
              >
                {/* Use Stack to align the buttons vertically */}
                <Stack
                  direction="column"
                  spacing={2}
                  sx={{ width: "100%", alignItems: "center" }}
                >
                  {/* <Button
                    variant="contained"
                    // type="submit"
                    data-blast="bgColor"
                    className="default-btn"
                    style={{
                      backgroundColor: `#00EDC5`,
                      // color: "black",
                      fontWeight: 700,
                      borderRadius: "24px",
                    }}
                  >
                    SAVE 50%
                  </Button> */}
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
                    {isItemInCart(item) ? "On Cart" : "Add to Cart"}
                  </Button>
                </Stack>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default SuggestedTlds;
