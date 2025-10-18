/* eslint-disable import/no-extraneous-dependencies */
import { useState } from "react";
import { StripeCardElement } from "@stripe/stripe-js";
import { useStripe, CardElement, useElements } from "@stripe/react-stripe-js";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
// import { Alert, LoadingButton } from '@mui/lab';
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Dialog, { DialogProps } from "@mui/material/Dialog";
import CustomPopover, { usePopover } from "./custom-popover";
import axiosInstance, { BASE_URL } from "@/axios/axiosInstance";
import { Alert, LoadingButton } from "@mui/lab";
import { primaryColor } from "@/utils/helpers";

interface Props extends DialogProps {
  onClose: VoidFunction;
  getPaymentMethods: any;
}

export default function PaymentNewCardDialog({
  onClose,
  getPaymentMethods,
  ...other
}: Props) {
  const popover = usePopover();
  //   const { user } = useAuthContext();

  //   const { enqueueSnackbar } = useSnackbar();

  const handleClose = () => {
    onClose();
  };

  const [err, setError] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const appearance = {
    style: {
      base: {
        iconColor: "#8F71DB",
        color: "#8F71DB",
        fontWeight: "500",
        fontFamily: "Urbanist, Public Sans,  sans-serif",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": {
          color: "#8F71DB",
        },
        "::placeholder": {
          color: "#8F71DB",
        },
      },
    },
  };

  const handlePaymentMethods = async (event: any) => {
    setError("");
    event.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    setPaymentProcessing(true);
    const cardElement = elements.getElement(CardElement);

    try {
      if (stripe) {
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement as StripeCardElement,
          billing_details: {
            name: "name",
            email: "email@gmail.com",
            phone: "",
          },
        });
        if (error) {
          console.error(error);
          setPaymentProcessing(false);
        } else {
          if (paymentMethod) {
            const cardData = {
              paymentMethodId: paymentMethod.id,
            };
            const response = await axiosInstance.post(
              `${BASE_URL}/freename/createPaymentMethod`,
              cardData
            );

            if (response.status === 200) {
              setPaymentProcessing(false);
              onClose();

              getPaymentMethods();
            } else {
              console.log("failed");
              //   enqueueSnackbar('Failed to add card', { variant: 'error' });
            }
            setPaymentProcessing(false);
          }
        }
      }
    } catch (error) {
      console.error(error);
      //   setError(error.message);
      setPaymentProcessing(false);
    }
  };

  return (
    <>
      <Dialog maxWidth="sm" onClose={onClose} {...other}>
        <DialogTitle> New Card </DialogTitle>

        {/* <FormProvider onSubmit={handlePaymentMethods}> */}
        <DialogContent sx={{ overflow: "unset" }}>
          <Stack spacing={2.5}>
            {/* <Elements stripe={stripePromise}> */}
            <Typography variant="body2">
              Your saved payment methods are encrypted and stored securely by
              Stripe.
            </Typography>
            <Stack spacing={2}>
              <CardElement options={appearance} />
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ typography: "caption", color: "text.disabled" }}
            >
              {/* <Iconify icon="carbon:locked" sx={{ mr: 0.5 }} /> */}
              Your transaction is secured with SSL encryption
            </Stack>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            style={{
              backgroundColor: `${primaryColor}`,
              color: "black",
              fontWeight: 700,
            }}
            variant="outlined"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <LoadingButton
            onClick={handlePaymentMethods}
            disabled={!stripe || paymentProcessing}
            loading={paymentProcessing}
            variant="contained"
            sx={{ ml: "auto", backgroundColor: "primary.main", color: "white" }}
          >
            {paymentProcessing ? "Processing..." : "Add Card"}
          </LoadingButton>
        </DialogActions>
        {/* </FormProvider> */}
        {!!err && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {err}
          </Alert>
        )}
      </Dialog>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="bottom-center"
        sx={{ maxWidth: 200, typography: "body2", textAlign: "center" }}
      >
        Three-digit number on the back of your VISA card
      </CustomPopover>
    </>
  );
}
