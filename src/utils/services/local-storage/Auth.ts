// User
export const setUserData = (data: any) => {
  localStorage.setItem("user", JSON.stringify(data));
  localStorage.setItem("user_login", JSON.stringify(true));
};

export const getUserData = () => {
  const isData = localStorage.getItem("user");
  if (!isData) {
    return null;
  }
  try {
    const data = JSON.parse(isData);
    return data;
  } catch (error) {
    console.error("Something went wrong:", error);
    return null;
  }
};

// export function getUserDataLocalStorage() {
//   let data = JSON.parse(localStorage.getItem("user_data")) || {};
//   return data;
// }

export const setPropertyData = (data: any) => {
  localStorage.setItem("property", JSON.stringify(data));
};

// export function getPropertyDataLocalStorage() {
//   let data = JSON.parse(localStorage.getItem("property")) || {};
//   return data;
// }

export const getUserLoginStatus = () => {
  const isUser = localStorage.getItem("user_login");
  if (!isUser) {
    return false;
  }
  try {
    const user = JSON.parse(isUser);
    return user;
  } catch (error) {
    console.error("Something went wrong:", error);
    return null;
  }
};

// Tokens
export const getUserTokens = () => {
  const isTokens = localStorage.getItem("tokens");
  if (!isTokens) {
    return null;
  }
  try {
    const tokens = JSON.parse(isTokens);
    return tokens;
  } catch (error) {
    console.error("Something went wrong:", error);
    return null;
  }
};

export const setUserTokens = (tokens: any) => {
  if (tokens) {
    localStorage.setItem("tokens", JSON.stringify(tokens));
  }
};

export const updateUserAccessToken = (newAccessToken: any) => {
  try {
    const existingToken = getUserTokens();
    const updatedTokens = {
      ...existingToken,
      access_token: newAccessToken,
    };
    setUserTokens(updatedTokens);
  } catch (error) {
    console.error("Error updating access token of user:", error);
  }
};

export const clearUserTokens = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("tokens");
  localStorage.removeItem("user_login");
};

export const UnAuthLogoutUser = () => {
  clearUserTokens();
  window.location.reload();
};
