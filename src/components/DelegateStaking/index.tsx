import { useCallback, useEffect, useState } from "react";
import classes from "@/styles/delegateStaking.module.scss";
import { FormControlLabel, NativeSelect, Switch } from "@mui/material";
import Pagination from "@mui/lab/Pagination";
import PaginationItem from "@mui/lab/PaginationItem";
import axios from "../../services/axios";
import { trimMiddlePartAddress } from "../../utils/accountAddress";
import useWalletSignature from "../../hooks/useWalletConnectSignature";
import { useDispatch } from "react-redux";
import DelegatePointsModal from "./DelegatePoints";
import { nFormatter } from "../../utils/formatNumber";
import LoadingTable from "../Base/LoadingTable";
import ModalRevoke from "./DelegatePoints/ModalRevoke";
import { BeatLoader } from "react-spinners";
import { useAppKitAccount } from "@reown/appkit/react";
const iconSearch = "/assets/images/icon-search.svg";
import commonStyles from '@/styles/commonstyle.module.scss'
import { toast } from "react-toastify";
import Image from "next/image";


export default function DelegateStaking() {

  const dispatch = useDispatch();

  const { address: connectedAccount } = useAppKitAccount();
  const { signature, signMessage, setSignature, error } = useWalletSignature();
  const {
    signature: signature1,
    signMessage: signMessage1,
    setSignature: setSignature1,
  } = useWalletSignature();
  const {
    signature: signature2,
    signMessage: signMessage2,
    setSignature: setSignature2,
    error: error2,
  } = useWalletSignature();

  const [delegatePointsList, setDelegatePointsList] = useState<any>([]);
  const [lodingDelegatePoints, setLoadingDelegatePoints] = useState<any>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [delegatePoints, setDelegatePoints] = useState<any>([]);
  const [showDelegateModal, setShowDelegateModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);

  const [walletAddress, setWalletAddress] = useState("");
  const [points, setPoints] = useState("");

  const [tierInfo, setTierInfo] = useState<any>("");
  const [revokeStakingPoints, setRevokeStakingPoints] = useState<any>("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<any>({
    loading: false,
    id: "",
  });
  const [revokeStatus, setRevokeStatus] = useState<any>(false);
  const [benefitType, setBenefitType] = useState("all");
  const [searchString, setSearchString] = useState("");

  const selectBenefitType = (type: string) => {
    setCurrentPage(1);
    setBenefitType(type);
  };
  const [id, setId] = useState<any>("");
  const [deleteId, setDeleteId] = useState<any>("");
  const [copied, setCopied] = useState<any>({
    address: "",
    id: "",
  });

  const copyToClipboard = (text: string = "", id: string = "") => {
    setCopied({
      address: text,
      id: id,
    });
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
    setTimeout(() => {
      setCopied({
        address: "",
        id: "",
      });
    }, 1000);
  };

  const getConfigHeader = useCallback(
    () => ({
      headers: {
        Authorization: `Bearer ${localStorage.getItem(
          `access_token:${connectedAccount}`
        )}`,
      },
    }),
    [connectedAccount]
  );

  const getDelegatePointsList = useCallback(async () => {
    setLoadingDelegatePoints(true);
    try {
      const response = await axios.get(
        `/user/delegate-staking-points?page=${currentPage}&limit=10&transaction_type=${benefitType}&search_text=${searchString}`,
        getConfigHeader()
      );
      const data = response?.data?.data || {};
      setDelegatePointsList(data.data || []);
      setTotalPage(data.lastPage || 0);
    } catch (error) {
      console.error("Error fetching delegate points list:", error);
    } finally {
      setLoadingDelegatePoints(false);
    }
  }, [currentPage, getConfigHeader, searchString, benefitType]);

  useEffect(() => {
    if (connectedAccount) {
      getDelegatePointsList();
    }
  }, [connectedAccount, currentPage, getDelegatePointsList]);

  const getTierInfo = useCallback(async () => {
    try {
      const response = await axios.get("/user/tier-info", getConfigHeader());
      setTierInfo(response.data?.data?.stakedInfo?.stakingPoints || 0);
    } catch (error) {
      console.error("Error fetching tier info:", error);
    }
  }, [getConfigHeader]);

  const getDelegateStakingPoints = useCallback(async () => {
    try {
      const response = await axios.get(
        "/user/delegate-staking-points-stats",
        getConfigHeader()
      );
      const data = response.data?.data || {};
      setDelegatePoints({
        totalStakingPointsDelegated: data.totalStakingPointsDelegated || 0,
        stakingPointsAvailableToDelegate:
          data.stakingPointsAvailableToDelegate || 0,
        stakingPointsFromDelegation: data.stakingPointsFromDelegation || 0,
      });
    } catch (error) {
      console.error("Error fetching delegate staking points:", error);
    }
  }, [getConfigHeader]);

  useEffect(() => {
    if (connectedAccount) {
      getTierInfo();
    }
  }, [connectedAccount, currentPage, id, getTierInfo]);

  useEffect(() => {
    if (connectedAccount) {
      getDelegateStakingPoints();
    }
  }, [connectedAccount, deleteId, walletAddress, getDelegateStakingPoints]);

  const resetForm = useCallback(() => {
    setSubmitLoading(false);
    setSignature("");
    setWalletAddress("");
    setPoints("");
    setShowDelegateModal(false);
  }, []);

  const createDelegatePoints = async () => {
    if (!walletAddress || !points) {
      toast.error("Please enter a wallet address and staking Points");
      return;
    }
    if (connectedAccount === walletAddress) {
      toast.error("You can't delegate points to yourself");
      return;
    }

    try {
      setSubmitLoading(true);
      const message = process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE;
      await signMessage(message);
    } catch (error) {
      console.error("Error signing message:", error);
      resetForm();
      setSubmitLoading(false);
    }
  };

  const submitData = useCallback(async () => {
    if (!walletAddress || !points) {
      toast.error("Please enter wallet address and Points");
      return;
    }

    try {
      const response = await axios.post(
        `/user/delegate-staking-points/create`,
        {
          points_delegated: points,
          target_wallet_address: walletAddress,
          wallet_address: connectedAccount,
          signature: signature,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              `access_token:${connectedAccount}`
            )}`,
            msgSignature: process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE,
          },
        }
      );

      if (response?.data?.status === 400) {
        toast.error(response?.data?.message);
      } else {
        toast.success("Points Delegated Successfully");
      }

      resetForm();
      getDelegatePointsList();
      getTierInfo();
      getDelegateStakingPoints();
    } catch (error) {
      console.error("Error submitting delegation:", error);
      resetForm();
    }
  }, [
    connectedAccount,
    getDelegatePointsList,
    getDelegateStakingPoints,
    getTierInfo,
    resetForm,
    signature,
    walletAddress,
    points,
    dispatch,
  ]);

  useEffect(() => {
    if (signature && connectedAccount) {
      submitData();
    }
  }, [signature, connectedAccount, submitData]);

  useEffect(() => {
    if (error) {
      resetForm();
      setSubmitLoading(false);
    }
  }, [error, dispatch, resetForm]);

  const updateStatus = async (checked: boolean, id: string, item: any) => {
    try {
      const message = process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE;
      await signMessage1(message);
      setRevokeStakingPoints(item);
      setRevokeStatus(checked);
      setId(id);
    } catch (error) {
      console.error("Error updating status:", error);
      setRevokeStatus(false);
      setId("");
    }
  };

  const revokePoints = async () => {
    try {
      const response: any = await axios.post(
        `/user/delegate-staking-points/updateStatus`,
        {
          id,
          is_active: !revokeStatus ? 1 : 0,
          wallet_address: connectedAccount,
          signature: signature1,
        },
        {
          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem(`access_token:${connectedAccount}`),
            msgSignature: process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE,
          },
        }
      );
      if (response?.message) {
        toast.error(response?.message || "Something went wrong");
        setSignature1("");
        setId("");
        setRevokeStakingPoints({});
      } else {
        if (response?.data?.status === 400) {
          if (revokeStatus) {
            setShowRevokeModal(true);
          } else {
            setSignature1("");
            setId("");
            setRevokeStakingPoints({});
            toast.error("Something went wrong");
          }
        } else {
          setSignature1("");
          setId("");
          setRevokeStakingPoints({});
          toast.success("Successfully Updated");
        }
      }
      setRevokeStatus(false);
      getDelegatePointsList();
      getDelegateStakingPoints();
      getTierInfo();
    } catch (error) {
      console.error("Error revoking points:", error);
      setSignature1("");
      setId("");
      setRevokeStatus(false);
      setRevokeStakingPoints({});
    }
  };

  const scheduleRevoke = async () => {
    if (revokeStakingPoints?.is_scheduled === 1) {
      toast.success("Already Scheduled");
      setRevokeStakingPoints({});
      setShowRevokeModal(false);
      setSignature1("");
      setId("");
      return;
    }
    setScheduleLoading(true);
    try {
      const response: any = await axios.post(
        `/user/delegate-staking-points/schedule-delete-delegation`,
        {
          signature: signature1,
          wallet_address: connectedAccount,
          id,
          is_scheduled: 1,
        },
        {
          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem(`access_token:${connectedAccount}`),
            msgSignature: process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE,
          },
        }
      );

      if (response?.data?.message) {
        toast.error("Something went wrong");
      } else {
        toast.success("Revoke Scheduled Successfully");
      }

      setScheduleLoading(false);
      setSignature1("");
      setId("");
      setShowRevokeModal(false);
      setRevokeStakingPoints({});
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Schedule Failed");
      setScheduleLoading(false);
      setSignature1("");
      setId("");
      setShowRevokeModal(false);
      setRevokeStakingPoints({});
    }
  };

  useEffect(() => {
    if (signature1) {
      revokePoints();
    }
  }, [signature1]);

  const deleteData = async (id: any) => {
    setDeleteLoading({
      loading: true,
      id: id,
    });
    setDeleteId(id);
    try {
      const message = process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE;
      await signMessage2(message);
    } catch (error) {
      console.error("Error deleting data:", error);
      setDeleteId("");
      setDeleteLoading({
        loading: false,
        id: "",
      });
    }
  };

  const deleteStakingPoints = async () => {
    try {
      const response: any = await axios.delete(
        `/user/delegate-staking-points/${deleteId}`,
        {
          data: { signature: signature2, wallet_address: connectedAccount },
          headers: {
            Authorization:
              "Bearer " +
              localStorage.getItem(`access_token:${connectedAccount}`),
            msgSignature: process.env.NEXT_PUBLIC_MESSAGE_INVESTOR_SIGNATURE,
          },
        }
      );
      if (response?.message) {
        toast.error("Something went wrong");
      } else {
        if (response?.data?.status === 400) {
          toast.error(response?.data?.message);
        } else {
          toast.success("Deleted Successfully");
        }
      }
      setDeleteLoading({
        loading: false,
        id: "",
      });
      setSignature2("");
      setDeleteId("");
      getDelegatePointsList();
      getTierInfo();
    } catch (error) {
      console.error("Error deleting staking points:", error);
      setSignature2("");
      setDeleteId("");
      setDeleteLoading({
        loading: false,
        id: "",
      });
    }
  };

  useEffect(() => {
    if (signature2) {
      deleteStakingPoints();
    }
  }, [signature2]);

  useEffect(() => {
    if (error2) {
      setSignature2("");
      setDeleteId("");
      setDeleteLoading({
        loading: false,
        id: "",
      });
    }
  }, [error2]);

  return (
    <>
      <div className={classes.delegateStaking}>
        <div className="delegate-staking-header">
          <div className="delegate-staking-header-title">
            <div className="delegate-staking-header-title-text">
              <Image width={32} height={24} src={"/assets/images/degen.svg"} alt="" />{" "}
              Total staking points
            </div>
            <div className="delegate-points">
              {nFormatter(tierInfo || 0, 2)}
            </div>
          </div>
          <div className="delegate-staking-header-title">
            <div className="delegate-staking-header-title-text">
              <Image
                width={32}
                height={24}
                src={"/assets/images/total-staking.svg"}
                alt=""
              />{" "}
              Total staking points delegated
            </div>
            <div className="delegate-points">
              {nFormatter(delegatePoints?.totalStakingPointsDelegated || 0, 2)}
            </div>
          </div>
          <div className="delegate-staking-header-title">
            <div className="delegate-staking-header-title-text">
              <Image
                width={32}
                height={24}
                src={"/assets/images/delegate-dollar.svg"}
                alt=""
              />{" "}
              Staking points available to delegate
            </div>
            <div className="delegate-points">
              {nFormatter(
                delegatePoints?.stakingPointsAvailableToDelegate || 0,
                2
              )}
            </div>
          </div>
          <div className="delegate-staking-header-title">
            <div className="delegate-staking-header-title-text">
              <Image
                width={32}
                height={24}
                src={"/assets/images/icon-invested.svg"}
                alt=""
              />{" "}
              Staking points from delegation
            </div>
            <div className="delegate-points">
              {nFormatter(delegatePoints?.stakingPointsFromDelegation || 0, 2)}
            </div>
          </div>
        </div>

        <div className="active-delegation">
          <span className="active-delegation-title">
            Your Active Delegations
          </span>

          <div className="controller-area__right">
            <div className="form-control-label">
              <NativeSelect
                // defaultValue="all"
                className={classes.poolTypeSelect}
                inputProps={{
                  name: "select_benefit",
                  id: "select-benefit",
                }}
                value={benefitType}
                onChange={(e) => selectBenefitType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="sent">SENT</option>
                <option value="revoked">REVOKED</option>
                <option value="received">RECEIVED</option>
              </NativeSelect>
            </div>
            <div className="form-control-label">
              <div className="controller-area__search">
                <input
                  value={searchString}
                  onChange={(e) => {
                    setSearchString(e.target.value);
                    setCurrentPage(1);
                  }}
                  type="text"
                  placeholder="Search by wallet address"
                  className={`${commonStyles.nnn1424h} ${classes.controleForm}`}
                />
                <Image
                width={23}
                height={23}
                  style={{ position: "absolute", left: "10px", top: "18px" }}
                  src={iconSearch}
                  alt=""
                />
              </div>
            </div>
          </div>

          <div
            className="delegate-btn cursor-pointer"
            style={{ cursor: "pointer" }}
            onClick={() => {
              setShowDelegateModal(true);
              setPoints("");
            }}
          >
            Delegate Points
          </div>
        </div>

        {lodingDelegatePoints ? (
          <div className={classes.tableLoading}>
            <LoadingTable />
          </div>
        ) : !connectedAccount ? (
          <div
            className="delegate-staking-no-data"
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "20px",
              color: "#000",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            Please Connect your wallet to view your active delegations
          </div>
        ) : delegatePointsList?.length === 0 ? (
          <div
            className="delegate-staking-no-data"
            style={{
              textAlign: "center",
              marginTop: "20px",
              fontSize: "20px",
              color: "#000",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            No Record Found
          </div>
        ) : (
          <div className="delegation-table">
            <table>
              <thead className="delegation-table-thead">
                <tr>
                  <th>
                    <span className="delegation-table-thead-text">
                      Source Wallet Address
                    </span>
                  </th>
                  <th>
                    <span className="delegation-table-thead-text">
                      Target Wallet Address
                    </span>
                  </th>
                  <th>
                    <span className="delegation-table-thead-text">
                      Points Delegated
                    </span>
                  </th>
                  <th>
                    <span className="delegation-table-thead-text">Revoke</span>
                  </th>
                  <th>
                    <span className="delegation-table-thead-text">ACTION</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {delegatePointsList?.map((item: any) => (
                  <tr key={item?.id}>
                    <td>
                      <div className="delegation-table-tbody-text">
                        <span>
                          {trimMiddlePartAddress(
                            item?.source_wallet_address,
                            10
                          )}
                        </span>
                        <Image
                          className="delegation-table-tbody-text-copy"
                          width={14}
                          height={14}
                          src={
                            copied?.address === item?.source_wallet_address &&
                            copied?.id === item?.id
                              ? "/assets/images/icon-check.svg"
                              : "/assets/images/delegate-copy.svg"
                          }
                          alt=""
                          onClick={() =>
                            copyToClipboard(
                              item?.source_wallet_address,
                              item?.id
                            )
                          }
                        />{" "}
                      </div>
                    </td>
                    <td>
                      <div className="delegation-table-tbody-text">
                        <span>
                          {trimMiddlePartAddress(
                            item?.target_wallet_address,
                            10
                          )}
                        </span>
                        <Image
                          className="delegation-table-tbody-text-copy"
                          width={14}
                          height={14}
                          src={
                            copied?.address === item?.target_wallet_address &&
                            copied?.id === item?.id
                              ? "/assets/images/icon-check.svg"
                              : "/assets/images/delegate-copy.svg"
                          }
                          alt=""
                          onClick={() =>
                            copyToClipboard(
                              item?.target_wallet_address,
                              item?.id
                            )
                          }
                        />{" "}
                      </div>
                    </td>

                    <td>
                      <span className="delegation-table-tbody-text-points">
                        {item?.points_delegated}
                      </span>
                    </td>
                    <td>
                      <div className="revoke-btn">
                        <FormControlLabel
                          control={
                            <Switch
                              name="checkedB"
                              classes={{
                                root: classes.root,
                                switchBase: classes.switchBase,
                                thumb: classes.thumb,
                                track: classes.track,
                                checked: classes.checked,
                              }}
                              disabled={item?.transaction_type === "received"}
                              checked={
                                item?.transaction_type !== "received" &&
                                !item?.is_active
                              }
                              onChange={(e: any) =>
                                updateStatus(e.target.checked, item?.id, item)
                              }
                            />
                          }
                          label=""
                        />
                      </div>
                    </td>
                    <td>
                      <div className="delegate-action">
                        <button
                          className="delete-btn"
                          onClick={() => deleteData(item?.id)}
                          disabled={item?.transaction_type === "received"}
                          style={{
                            cursor:
                              deleteLoading?.id === item?.id
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {deleteLoading?.id === item?.id ? (
                            <BeatLoader color={"#0066FF"} size={8} />
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!lodingDelegatePoints &&
          connectedAccount &&
          delegatePointsList?.length > 0 && (
            <div className="delegation-pagination">
              <Pagination
                count={totalPage}
                shape="rounded"
                className="pagination"
                page={currentPage}
                onChange={(e: any, value: any) => {
                  if (!lodingDelegatePoints) {
                    setCurrentPage(value);
                  }
                }}
                renderItem={(item: any) => (
                  <PaginationItem className="pagination-item" {...item} />
                )}
              />
            </div>
          )}
      </div>
      <DelegatePointsModal
        setPoints={setPoints}
        points={points}
        setWalletAddress={setWalletAddress}
        walletAddress={walletAddress}
        open={showDelegateModal}
        onClose={() => setShowDelegateModal(false)}
        onConfirm={createDelegatePoints}
        loading={submitLoading}
        delegatePoints={delegatePoints?.stakingPointsAvailableToDelegate}
      />
      <ModalRevoke
        open={showRevokeModal}
        onClose={() => {
          setSignature1("");
          setId("");
          setShowRevokeModal(false);
          setShowRevokeModal(false);
        }}
        onConfirm={scheduleRevoke}
        loading={scheduleLoading}
      />
    </>
  );
}
