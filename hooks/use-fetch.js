import { useState } from "react";

/* create a custom hook useFetch which help us to fetch data  every single time efficiently or make API calls

 custom hooks have power of accessing every single feature of react

 it will take callback function and state for handling errors , handling loading and handling the data

 ...args are additional arguments that user is providing 


 ( ...args means it can accept any number of arguments (to be passed to cb). )

 fn → a function to actually trigger the fetch with arguments. 

 You pass a callback function (cb) when you use this hook.

 That callback is usually an async function (like a fetch or API call).

 This hook is a reusable way to handle async requests with built-in loading, error, and data state management!  

*/

const useFetch = (cb) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);

    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data , fn};
};

export default useFetch