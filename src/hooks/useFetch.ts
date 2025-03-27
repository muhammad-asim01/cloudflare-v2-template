import { useCallback, useEffect, useState } from "react";
import axios from "../services/axios";
import { getConfigHeader } from "../utils/configHeader";

type useFetchReturnType<T> = {
  loading: boolean;
  error: string;
  data: T | undefined;
  refetchData: any;
};

const useFetch = <T>(
  uriProps: string | undefined,
  suspendRender: any = false,
  config: any = {},
  needAuth: boolean = true
): useFetchReturnType<T> => {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string>("");
  const [uri, setUri] = useState(uriProps);
  const [refetch, setRefetch] = useState<boolean>(false);

  const fetchDataFromUri = useCallback(async () => {
    setLoading(true);

    try {
      // some Api no need authentication to fetch
      let configs = { ...config };
      if (needAuth) {
        const configHeader = getConfigHeader();
        configs = { ...configs, ...configHeader };
      }

      const response = (await axios.get(uri as string, configs)) as any;
      if (response.data) {
        setData(response?.data?.data);
      }

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
    }
  }, [uri]);

  useEffect(() => {
    if (uriProps) {
      setUri(uriProps);
    }
  }, [uriProps]);

  useEffect(() => {
     if (uri && !suspendRender) {
      fetchDataFromUri();
     }
  }, [uri, suspendRender, refetch]);

  const refetchData = (uriRefetch: string | undefined) => {
    setRefetch((prev) => !prev);
    setUri(uriRefetch);
  };

  return {
    loading,
    error,
    data,
    refetchData,
  };
};

export default useFetch;
