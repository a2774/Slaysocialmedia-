// import * as Yup from "yup";
// import { useForm } from "react-hook-form";
// import { useState, useEffect } from "react";
// import { yupResolver } from "@hookform/resolvers/yup";

// import Box from "@mui/material/Box";
// import Dialog from "@mui/material/Dialog";
// import LoadingButton from "@mui/lab/LoadingButton";
// import DialogTitle from "@mui/material/DialogTitle";
// import DialogActions from "@mui/material/DialogActions";
// import DialogContent from "@mui/material/DialogContent";
// import {
//   Stack,
//   Button,
//   IconButton,
//   InputAdornment,
//   TextField,
// } from "@mui/material";
// import FormProvider from "../hook-form/form-provider";
// import { primaryColor } from "@/utils/helpers";

// // import axios, { endpoints } from 'src/utils/axios';

// // import { enqueueSnackbar } from 'src/components/snackbar';
// // import FormProvider, { TextField } from 'src/components/hook-form';
// // ----------------------------------------------------------------------
// type Props = {
//   open: boolean;
//   onClose: VoidFunction;
//   eventId: any;
// };
// export default function AddPromoterForm({ eventId, open, onClose }: Props) {
//   const [isReferralCodeValid, setReferralCodeValid] = useState(false);
//   const NewUserSchema = Yup.object().shape({
//     name: Yup.string().required("Name is required"),
//     email: Yup.string()
//       .required("Email is required")
//       .email("Email must be a valid email address"),
//     phoneNumber: Yup.string()
//       // .required('Phone number is required')
//       // .min(10, 'Phone number should be at least 10 digits')
//       .matches(/^\d+$/, "Phone number should only contain digits"),
//     commissionPercentage: Yup.number()
//       .required("Commission is required")
//       .min(0, "Commission percentage cannot be less than 0")
//       .max(100, "Commission percentage cannot be more than 100"),
//     discountPercentage: Yup.number()
//       .required("Discount is required")
//       .min(0, "Discount percentage cannot be less than 0")
//       .max(100, "Discount percentage cannot be more than 100"),
//     ticketLimit: Yup.number()
//       .required("Ticket Limit is required")
//       .moreThan(0, "Ticket Limit should be greater than 0"),
//     referralCode: Yup.string().required("Referral Code is required"),
//   });
//   const methods = useForm({
//     resolver: yupResolver(NewUserSchema),
//   });

//   const {
//     reset,
//     handleSubmit,
//     watch,
//     setError,
//     clearErrors,
//     formState: { isSubmitting },
//   } = methods;

//   const referralCodeWatch = watch("referralCode");

//   // useEffect(() => {
//   //   setReferralCodeValid(false);
//   // }, [referralCodeWatch]);
//   // const validatePromoCode = async () => {
//   //   try {
//   //     const referralCode = watch('referralCode');
//   //     const response = await axios.get(
//   //       `${endpoints.promoter.validateReferrelCodeUnique(referralCode)}`
//   //     );
//   //     setReferralCodeValid(true);
//   //     clearErrors('referralCode');
//   //   } catch (error) {
//   //     setError('referralCode', {
//   //       type: 'manual',
//   //       message: 'Referral Code already used',
//   //     });
//   //   }
//   // };
//   const onSubmit = async (data: any) => {
//     // if (!isReferralCodeValid) {
//     //   return setError('referralCode', {
//     //     type: 'manual',
//     //     message: 'Please validate Referral Code',
//     //   });
//     // }
//     // const { phoneNumber, ...rest } = data;
//     // const newData = phoneNumber === '0' ? rest : { ...rest, phoneNumber };
//     // try {
//     //   const response = await axios.post(`${endpoints.promoter.createPromoters}${eventId}`, newData);
//     //   console.log(':rocket: ~ onSubmit ~ response:', response);
//     //   if (response.status === 201) {
//     //     await new Promise((resolve) => setTimeout(resolve, 500));
//     //     reset();
//     //     onClose();
//     //     // enqueueSnackbar('Update success!', {
//     //     //   variant: 'success',
//     //     // });
//     //   } else {
//     //     // enqueueSnackbar('Update failed!', {
//     //     //   variant: 'error',
//     //     // });
//     //   }
//     // } catch (error) {
//     //   console.error('API call error:', error);
//     //   // return enqueueSnackbar(error?.error || 'Update failed!', {
//     //   //   variant: 'error',
//     //   // });
//     // }
//     // return null;
//   };
//   const preventNegative = (e: any) => {
//     if (e.key === "-" || e.key === "e" || e.key === "E") {
//       e.preventDefault();
//     }
//   };
//   return (
//     <Dialog
//       fullWidth
//       maxWidth={false}
//       open={open}
//       onClose={onClose}
//       PaperProps={{
//         sx: { maxWidth: 720 },
//       }}
//     >
//       <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
//         <DialogTitle
//           color="primary"
//           style={{
//             color: "#5138EE",
//           }}
//         >
//           Add Promoter
//         </DialogTitle>
//         <DialogContent>
//           <Box
//             rowGap={3}
//             columnGap={3}
//             display="grid"
//             marginTop={1}
//             gridTemplateColumns={{
//               xs: "repeat(1, 1fr)",
//               sm: "repeat(2, 1fr)",
//             }}
//           >
//             <TextField name="name" label="Full Name" />
//             <TextField name="email" label="Email Address" />
//             <TextField name="phoneNumber" type="number" label="Phone Number" />
//             <TextField
//               name="commissionPercentage"
//               type="number"
//               label="Commission (In %)"
//               onKeyDown={preventNegative}
//               placeholder="0.00"
//               //  min="0"
//               InputProps={{
//                 inputProps: { min: 0, max: 100 },
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <Box
//                       sx={{ typography: "subtitle2", color: "text.disabled" }}
//                     >
//                       %
//                     </Box>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//             <TextField
//               name="ticketLimit"
//               type="number"
//               label="Limit"
//               InputProps={{
//                 inputProps: { min: 1 },
//               }}
//               onKeyDown={preventNegative}
//             />
//             <TextField
//               name="discountPercentage"
//               type="number"
//               label="Discount (In %)"
//               placeholder="0.00"
//               onKeyDown={preventNegative}
//               InputProps={{
//                 inputProps: { min: 0, max: 100 },
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <Box
//                       sx={{ typography: "subtitle2", color: "text.disabled" }}
//                     >
//                       %
//                     </Box>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Box>
//           <Stack spacing={5} sx={{ paddingTop: "25px" }}>
//             <TextField
//               name="referralCode"
//               label="Referral Code"
//               // InputLabelProps={{ shrink: true }}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment sx={{ pr: "0px" }} position="end">
//                     <IconButton
//                       size="small"
//                       {...(isReferralCodeValid ? { color: "info" } : {})}
//                       sx={{
//                         fontSize: 15,
//                         p: 0,
//                         fontFamily: "Public Sans",
//                       }}
//                       // onClick={() => validatePromoCode()}
//                     >
//                       {isReferralCodeValid ? "Checked" : "Check"}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Stack>
//         </DialogContent>
//         <DialogActions>
//           <LoadingButton
//             type="submit"
//             variant="contained"
//             // color="primary"
//             style={{
//               backgroundColor: `${primaryColor}`,
//             }}
//             loading={isSubmitting}
//           >
//             Add Promoter
//           </LoadingButton>
//           <Button variant="outlined" color="inherit" onClick={onClose}>
//             Cancel
//           </Button>
//         </DialogActions>
//       </FormProvider>
//     </Dialog>
//   );
// }
