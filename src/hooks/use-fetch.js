import { useState, useRef } from "react";

const useFetch = (cb) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      if (mountedRef.current) {
        setData(response);
      }
      return response;
    } catch (err) {
      if (mountedRef.current) {
        setError(err?.message || "Request failed");
      }
      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;