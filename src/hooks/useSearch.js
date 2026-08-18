import { useState, useCallback } from 'react';
import searchService from '../services/searchService';

export const useSearch = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refetch = useCallback(async (query) => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const res = await searchService.querySearch(query);
      setData(res);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, refetch };
};

export default useSearch;
