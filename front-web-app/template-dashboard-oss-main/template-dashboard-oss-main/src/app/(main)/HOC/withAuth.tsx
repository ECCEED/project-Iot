"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthWrapper = (props: any) => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(Boolean(localStorage.getItem("admin-auth-token")));

    useEffect(() => {
      const checkAuth = () => {
        const token = localStorage.getItem("admin-auth-token");
        setIsLoggedIn(Boolean(token));
        if (!token) {
          router.push("/adminlogin");
        }
      };


      window.addEventListener("storage", checkAuth);


      checkAuth();


      return () => {
        window.removeEventListener("storage", checkAuth);
      };
    }, [router]);

    if (!isLoggedIn) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthWrapper;
};

export default withAuth;
