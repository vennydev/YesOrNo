import { useState } from "react"

export default function useLoading() {
  const [isLoading, setIsLoading] = useState(false);

  const loading = () => setIsLoading(true);
  const loadDone = () => setIsLoading(false);

  return {
    isLoading,
    loading,
    loadDone
  }
}