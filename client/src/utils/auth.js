export const getSessionSnapshot = () => {
  try {
    return localStorage.getItem("userInfo");
  } catch {
    return null;
  }
};

export function parseSession(value) {
  try {
    const user = JSON.parse(value);
    return user &&
      typeof user.token === "string" &&
      user.token.trim() &&
      (user.role === "admin" || user.role === "customer")
      ? user
      : null;
  } catch {
    return null;
  }
}

export const getUserInfo = () => parseSession(getSessionSnapshot());
export const hasAdminAccess = (user) =>
  user?.role === "admin" &&
  typeof user.token === "string" &&
  !!user.token.trim();
export const isAdminLoggedIn = () => hasAdminAccess(getUserInfo());

export const isCustomerLoggedIn = () => {
  const user = getUserInfo();
  return !!user && user.role === "customer" && !!user.token;
};

const notifySessionChange = () =>
  window.dispatchEvent(new Event("orniva:auth-change"));

export function saveUserInfo(user) {
  if (!parseSession(JSON.stringify(user)))
    throw new Error("Invalid sign-in response");
  localStorage.setItem("userInfo", JSON.stringify(user));
  notifySessionChange();
}

export const logoutUser = () => {
  localStorage.removeItem("userInfo");
  notifySessionChange();
};

export function subscribeToSession(listener) {
  function onStorage(event) {
    if (event.key === "userInfo" || event.key === null) listener();
  }
  window.addEventListener("orniva:auth-change", listener);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener("orniva:auth-change", listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function safeReturnPath(value) {
  return typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    !value.includes("\\") &&
    ![...value].some((character) => character.charCodeAt(0) < 32)
    ? value
    : null;
}

export function loginDestination(user, requestedPath) {
  const path = safeReturnPath(requestedPath);
  const ownerPath = /^\/admin(?:[/?#]|$)/i.test(path || "");
  const loginPath = /^\/(?:admin\/)?(?:login|register)(?:[/?#]|$)/i.test(
    path || "",
  );
  if (path && !loginPath && (!ownerPath || hasAdminAccess(user))) return path;
  return hasAdminAccess(user) ? "/admin" : "/my-orders";
}

export const getAuthConfig = () => {
  const user = getUserInfo();

  return {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };
};
