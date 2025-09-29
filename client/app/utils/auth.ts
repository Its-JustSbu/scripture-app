import { useEffect, useState } from "react";

export function isAuthenticated() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tokenKey = localStorage.getItem("token");
      if (tokenKey) {
        const payload = JSON.parse(atob(tokenKey.split(".")[1]));
        if (payload) setAuthenticated(!!tokenKey);
        else setAuthenticated(false);
      }
    }
  }, []);

  return authenticated;
}

export function isAdmin() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setAdmin(payload.role == "admin");
      } else {
        setAdmin(false);
      }
    }
  }, []);

  return admin;
}

export function getUserID() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } else {
      return null;
    }
  }
}

export function getUserRole() {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role;
    } else {
      return null;
    }
  }
}
