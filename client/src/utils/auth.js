export const getUserInfo = () => {
  const data = localStorage.getItem("userInfo");
  return data ? JSON.parse(data) : null;
};

export const isAdminLoggedIn = () => {
  const user = getUserInfo();
  return !!user && user.role === "admin" && !!user.token;
};

export const isCustomerLoggedIn = () => {
  const user = getUserInfo();
  return !!user && user.role === "customer" && !!user.token;
};

export const logoutUser = () => {
  localStorage.removeItem("userInfo");
};

export const getAuthConfig = () => {
  const user = getUserInfo();

  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};