import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";

import { Box, Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import axiosInstance, { BASE_URL } from "@/axios/axiosInstance";
import { toast } from "react-toastify";
import { primaryColor } from "@/utils/helpers";
import { calculateTotal } from "../Header";
import { getDiscountFromLocalStorage } from "@/utils/cart";
import React from "react";

export default function CheckoutForm({
  createPaymentIntentId,
  email,
  onClose,
  amount,
}: any) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentElementLoaded, setPaymentElementLoaded] = useState(false);
  const navigate = useRouter();

  const handlePaymentElementLoad = () => {
    setPaymentElementLoaded(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (response.paymentIntent?.status === "succeeded") {
        const paymentData = {
          paymentIntentId: createPaymentIntentId,
        };
        const checkPayment = await axiosInstance.post(
          `${BASE_URL}/freename/retrievePaymentIntent`,
          paymentData
        );
        toast.success("Domain purchased successfully", {
          position: "top-right",
          style: {
            top: "120px", // Adjusts the position slightly above the bottom
          },
        });
        localStorage.removeItem("cart");
        window.location.assign("/domain");
        onClose();

        // if (checkPayment.data.message) {
        //   toast.success("Domain purchased successfully");
        // } else {
        //   toast.error(
        //     "Payment Failed due internal server. Please contact support"
        //   );
        // }
      }
    } catch (error) {
      toast.error("Something went wrong! Please contact support", {
        position: "top-right",
        style: {
          top: "120px", // Adjusts the position slightly above the bottom
        },
      });
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <Box sx={{ minHeight: "360px" }}>
        {stripe && elements ? (
          <>
            <LinkAuthenticationElement id="link-authentication-element" />
            <Box sx={{ display: paymentElementLoaded ? "block" : "none" }}>
              <PaymentElement
                id="payment-element"
                options={{
                  defaultValues: {
                    billingDetails: {
                      email,
                    },
                  },
                }}
                onReady={handlePaymentElementLoad}
              />
              <Box sx={{ paddingTop: 2 }}>Total Pay Amount: $ {amount}</Box>
            </Box>
          </>
        ) : (
          <></>
        )}
      </Box>

      <Button
        fullWidth
        variant="contained"
        data-blast="bgColor"
        style={{
          backgroundColor: `${primaryColor}`,
          color: "black",
          padding: "16px",
          fontWeight: 700,
          marginTop: "24px",
        }}
        type="submit"
        disabled={isLoading || !stripe || !elements || !paymentElementLoaded}
      >
        {isLoading ? <CircularProgress sx={{ color: "white" }} /> : "Pay now"}
      </Button>
    </form>
  );
}
