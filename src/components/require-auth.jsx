import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { UrlState } from "@/context";
import { BarLoader } from "react-spinners";

function RequireAuth({ children }) {
  const navigate = useNavigate();
  const { loading, isAuthenticated } = UrlState();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/auth", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return <BarLoader width="100%" color="#36d7b7" />;
  }

  if (!isAuthenticated) {
    return null; // important fallback
  }

  return children;
}

export default RequireAuth;
