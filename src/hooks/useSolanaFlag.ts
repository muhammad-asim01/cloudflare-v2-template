import { useState, useEffect } from "react";
import { getFlag } from "../utils/config";

const useSolanaFlag = () => {
  const [isSolanaEnable, setIsSolanaEnable] = useState(false);

  useEffect(() => {
    const fetchFlags = async () => {
      try {
        const flags = await getFlag();
        const solanaFlag = flags?.data?.find(
          (flag: any) => flag?.name === "solana"
        );
        setIsSolanaEnable(solanaFlag?.value === 1);
      } catch (err) {
        console.error("Failed to fetch Solana flag", err);
      }
    };

    fetchFlags();
  }, []);

  return isSolanaEnable;
};

export default useSolanaFlag;