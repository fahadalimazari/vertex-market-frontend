import { useState } from 'react';
import newsletterService from '../services/newsletterService';

export const useNewsletter = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const subscribe = async (email, source) => {
    setLoading(true);
    setError(null);
    try {
      const res = await newsletterService.subscribe(email, source);
      setData(res);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { subscribe, loading, error, data };
};

export default useNewsletter;
