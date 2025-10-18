import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { primaryColor } from "@/utils/helpers";

export const AddressModal = ({ open, onClose }: any) => {
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    // Handle form submission here

    onClose(); // Close the modal after submission
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Address Details</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            name="name"
            label="Name"
            variant="outlined"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="street"
            label="Street"
            variant="outlined"
            value={formData.street}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="city"
            label="City"
            variant="outlined"
            value={formData.city}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="postalCode"
            label="Postal Code"
            variant="outlined"
            value={formData.postalCode}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="country"
            label="Country"
            variant="outlined"
            value={formData.country}
            onChange={handleChange}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          style={{
            backgroundColor: `${primaryColor}`,
            color: "black",
            fontWeight: 700,
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// const App = () => {
//   const [modalOpen, setModalOpen] = useState(false);

//   const handleOpen = () => setModalOpen(true);
//   const handleClose = () => setModalOpen(false);

//   return (
//     <div>
//       <Button variant="contained" color="primary" onClick={handleOpen}>
//         Open Address Modal
//       </Button>
//       <AddressModal open={modalOpen} onClose={handleClose} />
//     </div>
//   );
// };

// export default App;
