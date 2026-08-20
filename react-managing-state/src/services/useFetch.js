import { Children } from 'react';
import { useState, useRef, useEffect } from 'react';

const baseUrl = process.env.REACT_APP_API_BASE_URL;

export default function useFetch(url) {
  const isMounted = useRef(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    isMounted.current = true;
    async function init() {
      try {
        const res = await fetch(baseUrl + url);
        if (res.ok) {
          const json = await res.json();
          if (isMounted.current) setData(res);
        } else {
          throw res;
        }
      } catch (e) {
        if (isMounted.current) setError(e);
      } finally {
        if (isMounted.current) setLoading(false);
      }
    }
    init();
    return () => {
      isMounted.current = false;
    };
  }, [url]);

  return { data, error, loading };
}


export function Fetch(url) {
  const { data, loading, error } = useFetch(url);
  return Children(data, loading, error);
}