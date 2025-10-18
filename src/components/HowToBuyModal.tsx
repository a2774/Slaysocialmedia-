import { primaryColor } from "@/utils/helpers";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";

const HowToBuyModal = ({ open, handleClose }: any) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      //   sx={{
      //     backgroundColor: "#5138EE",
      //   }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: '"#5138EE"', // Custom background color
          color: "#fff", // Custom text color
        },
        "& .MuiPaper-root": {
          backgroundColor: "#1a1a1a", // Custom background color
          color: "#fff", // Custom text color
        },
      }}
    >
      <DialogTitle
        style={{
          color: "red !important",
        }}
      >
        How to Buy a Domain
      </DialogTitle>
      <DialogContent
        dividers
        sx={{
          backgroundColor: "#1a1a1a !important", // Force background color
          color: "#fff !important", // Force text color
        }}
      >
        <Typography variant="h6">Step 1: Login or Register:</Typography>
        <Typography
          sx={{
            color: "white",
          }}
        >
          Login to the Singh Platform using your email and password. If you
          don’t have an account, simply register.
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Step 2: Search for a Domain:</Typography>
        <Typography>Use the search bar to find the domain you want.</Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Step 3: Connect Your Wallet:</Typography>
        <Typography>
          Click the Connect Wallet button to link your crypto wallet. If you don
          not have a MetaMask wallet, you can download it first.
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Step 4: Add Domain to Cart:</Typography>
        <Typography>
          Click the Add to Cart button to include your chosen domain in your
          shopping cart.
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Step 5: Review Your Cart:</Typography>
        <Typography>
          Double-check the items in your cart and make any necessary changes
          before proceeding. Proceed to Checkout: Once satisfied, click the
          Proceed to Checkout button.
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Step 6: Enter Billing Information:</Typography>
        <Typography>
          Fill in your payment details, including your name, address, and
          payment method.
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Step 7: Complete Payment:</Typography>
        <Typography>
          Click the Pay Now button to finalize your purchase.
        </Typography>
        <Divider sx={{ my: 2 }} />

        <Typography variant="h6">Step 8: Verify Your Domain:</Typography>
        <Typography>
          Head to your domain list to confirm your newly purchased domain is
          there.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          type="submit"
          data-blast="bgColor"
          style={{
            backgroundColor: `${primaryColor}`,
            color: "black",
            fontWeight: 700,
          }}
          onClick={handleClose}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default HowToBuyModal;
