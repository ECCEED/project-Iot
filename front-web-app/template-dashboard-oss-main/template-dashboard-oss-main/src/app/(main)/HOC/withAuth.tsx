import React from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const AuthWrapper = (props: any) => {
    const router = useRouter();
    const isLoggedIn = Boolean(localStorage.getItem("admin-auth-token"));

    React.useEffect(() => {
      if (!isLoggedIn) {
        router.push("/adminlogin"); // Redirect to login if not authenticated
      }
    }, [isLoggedIn, router]);

    if (!isLoggedIn) {
      return null; // Return nothing while redirecting
    }

    return <WrappedComponent {...props} />;
  };

  return AuthWrapper;
};

export default withAuth;
