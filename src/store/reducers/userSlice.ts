import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  ForgetPassword,
  ResetPassword,
  // ConnectWallet,
  // Logout,
  UserLogin,
  UserSignup,
  UserVerifyOtp,
} from "../thunks/userThunk";
import { getCartFromLocalStorage } from "@/utils/cart";

// import { getUserTokens } from "@/utils/services/local-storage/Auth";

// User Login thunk
export const UserLoginThunk = createAsyncThunk("/user/login", UserLogin);
export const UserSignupThunk = createAsyncThunk("/user/signup", UserSignup);
export const UserVerifyOtpThunk = createAsyncThunk(
  "/user/verify",
  UserVerifyOtp
);

export const ForgetPasswordThunk = createAsyncThunk(
  "user/forgetPassword",
  ForgetPassword
);

export const ResetPasswordThunk = createAsyncThunk(
  "user/resetPassword",
  ResetPassword
);

// export const ConnectWalletThunk = createAsyncThunk(
//   "/connect_wallet",
//   ConnectWallet
// );

// export const LogoutThunk = createAsyncThunk("/logout_user", Logout);

// initial state
const initialState = {
  loading: {},
  isLoading: false,
  userLoginEmail: null,
  // userLoggedIn: getUserData() ? true : false,
  // userTokens: getUserTokens() || null,
  status: "idle",
  isConnectedWithWallet: false,
  walletAddress: "",
  cart: getCartFromLocalStorage(),
  activate: false,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setStatus: (state, action) => {
      state.status = action.payload;
    },

    unsetLoading: (state) => {
      state.isLoading = false;
    },

    onDisconnect: (state) => {
      state.walletAddress = "";
    },

    onGlobalAddToCart: (state, action) => {
      const item = action.payload;

      const itemIndex = state.cart.findIndex(
        (cartItem: any) => cartItem.name === item.name
      );

      if (itemIndex > -1) {
      } else {
        state.cart.push({ ...item });
      }
    },

    onGlobalRemoveFromCart: (state, action) => {
      const item1 = action.payload;

      const updatedCartItems = state.cart.filter(
        (item: any) => item.name !== item1.name
      );

      state.cart = updatedCartItems;
    },
    onClearGlobalCart: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder

      // User Login
      .addCase(UserLoginThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UserLoginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(UserLoginThunk.rejected, (state, action) => {
        state.isLoading = false;

        if (action?.error?.message === "Request failed with status code 410") {
          state.activate = true;
        }
      })
      //Signup
      .addCase(UserSignupThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UserSignupThunk.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(UserSignupThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      //UserVerifyOtpThunk
      .addCase(UserVerifyOtpThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(UserVerifyOtpThunk.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(UserVerifyOtpThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      //ForgetPasswordThunk
      .addCase(ForgetPasswordThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ForgetPasswordThunk.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(ForgetPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
      })
      //ResetPasswordThunk
      .addCase(ResetPasswordThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(ResetPasswordThunk.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(ResetPasswordThunk.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const {
  setStatus,
  unsetLoading,
  onDisconnect,
  onGlobalAddToCart,
  onGlobalRemoveFromCart,
  onClearGlobalCart,
} = userSlice.actions;

export default userSlice.reducer;
