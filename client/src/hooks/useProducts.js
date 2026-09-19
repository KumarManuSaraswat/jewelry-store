import { useEffect, useState } from "react";
import api from "../api/axios";
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/api/products", { signal: controller.signal })
      .then(({ data }) => {
        setProducts(data);
        setError("");
      })
      .catch((err) => {
        if (err.code !== "ERR_CANCELED")
          setError(
            "We couldn’t load the collection. Please try again in a moment.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);
  return {
    products,
    loading,
    error,
    retry: () => {
      setLoading(true);
      setAttempt((value) => value + 1);
    },
  };
}
