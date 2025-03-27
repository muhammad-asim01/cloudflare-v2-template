import { useDispatch } from "react-redux";
import { solanaConnectWallet, solanaSetWalletAddress } from "@/store/slices/solanaWalletSlice";
import styles from "@/styles/servicesRegion.module.scss";

const SolanaConnectWallet = ({setWalletAddress} : any) => {
  const dispatch = useDispatch();

  return (
    <div>
      {window.solana && window.solana.isPhantom && (
        <div className={"btn-container"}>
          <button
            className={styles.btnCalendar}
            onClick={async () => {
              const resp = await window.solana.connect();
              dispatch(solanaConnectWallet());
              dispatch(solanaSetWalletAddress(resp?.publicKey?.toString()));
              setWalletAddress(resp?.publicKey?.toString())
            }}
          >
            Connect Solana Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default SolanaConnectWallet;
