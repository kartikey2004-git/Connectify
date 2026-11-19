import { useCallback, useState } from "react";

/**
 * Wraps an async function (typically a server action) with loading/error/data state.
 *
 * `fn(...args)` calls the wrapped function and resolves with its result, or with
 * `undefined` when it threw (the error is exposed through `error` instead).
 */
export default function useFetch(callback) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const response = await callback(...args);
        setData(response);
        return response;
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [callback],
  );

  return { loading, error, data, fn };
}
