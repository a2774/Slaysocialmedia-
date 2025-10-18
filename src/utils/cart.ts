// cartUtils.js
export const getCartFromLocalStorage = () => {
  if (typeof window === "undefined") return []; // Check if window is undefined
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const getSelectedRoyaltiesFromLocalStorage = () => {
  if (typeof window === "undefined") return []; // Check if window is undefined
  const royalty = localStorage.getItem("selectedRoyalties");
  return royalty ? JSON.parse(royalty) : [];
};

export const getProfileFromLocalStorage = () => {
  if (typeof window === "undefined") return []; // Check if window is undefined
  const profile = localStorage.getItem("profile");
  return profile ? JSON.parse(profile) : [];
};

export const saveCartToLocalStorage = (cart: any) => {
  if (typeof window === "undefined") return; // Check if window is undefined
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const saveCouponToLocalStorage = (coupon: string) => {
  if (typeof window === "undefined") return; // Check if window is undefined
  localStorage.setItem("referralCoupon", JSON.stringify(coupon));
};

export const getCouponFromLocalStorage = () => {
  if (typeof window === "undefined") return; // Check if window is undefined
  const coupon = localStorage.getItem("referralCoupon");
  return coupon ? JSON.parse(coupon) : "";
};

export const getDiscountFromLocalStorage = () => {
  if (typeof window === "undefined") return; // Check if window is undefined
  const discount = localStorage.getItem("discountPercentage");
  return discount ? JSON.parse(discount) : "";
};

export const saveProfileToLocalStorage = (profile: any) => {
  if (typeof window === "undefined") return; // Check if window is undefined
  localStorage.setItem("profile", JSON.stringify(profile));
};

export const addToCart = (item: any) => {
  if (typeof window === "undefined") return; // Check if running on the server

  const cart = getCartFromLocalStorage();
  const itemIndex = cart.findIndex(
    (cartItem: any) => cartItem.name === item.name
  );

  if (itemIndex > -1) {
  } else {
    cart.push({ ...item });
  }

  saveCartToLocalStorage(cart);
};

export const clearTokens = () => {
  localStorage.removeItem("profile");
  localStorage.removeItem("cart");
  localStorage.removeItem("discountPercentage");
  localStorage.removeItem("referralCoupon");
};
