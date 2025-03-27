"use client";

import Pagination from "@mui/lab/Pagination";
import PaginationItem from "@mui/lab/PaginationItem";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DefaultLayout from "@/components/Layout/DefaultLayout";
import useFetch from "@/hooks/useFetch";
import styles from "@/styles/pools.module.scss";
import LoadingTable from "@/components/Base/LoadingTable";
import { isMobile } from "react-device-detect";
// import CardCompletedSales from "../Dashboard/CardCompletedSales";
import { isNumber } from "lodash";
import { Select } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useRouter } from "next/navigation";

const iconSearch = "/assets/images/icons/icon_search.svg";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
import commonStyle from '@/styles/commonstyle.module.scss'
import CardCompletedSales from "@/components/Dashboard/CardCompletedSales";
import IdoPoolCard from "./IdoPoolCard";
import Image from "next/image";

 
const Pools = () => {
  const history = useRouter();
  const { data: appChain } = useSelector((state: any) => state.appNetwork);
  const { data: connector } = useSelector((state: any) => state.connector);

  const [input, setInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pools, setPools] = useState([]);



  const [sort, setSort] = useState("");
  const { data: poolsList, loading: loadingGetPool } = useFetch<any>(
    `/pools?page=${currentPage}&limit=10&title=${input}&sort=${sort}`
  );

  const sortOptions = [
    { value: "ath_roi", babel: "ATH ROI" },
    { value: "finish_time", babel: "Date" },
  ];

  const handleSortChange = (e: any) => {
    setSort(e.target.value);
  };

  const handleInputChange = debounce((e: any) => {
    Promise.resolve().then(() => {
      setInput(e.target.value);
      setCurrentPage(1);
    });
  }, 500);

  useEffect(() => {
    const manipulatePoolsData = async () => {
      setTotalPage(poolsList.lastPage);
      setCurrentPage(poolsList.page);

      let listData = poolsList.data;
      const poolWithStatus: any[] = [];
      const symbolList = listData.map((dt: any) => {
        return dt.symbol;
      });

      if (symbolList.length > 0) {
        const searchParams = symbolList.join(",");
        await axios
          .get(`${baseUrl}/token-price?page=0&search=${searchParams}`)
          .then((response) => {
            for (let i = 0; i < listData.length; i++) {
              const pool = { ...listData[i] };
              const tokenPrice = response.data.data.data.find(
                (dt: any) => dt.token_symbol === pool.symbol.toUpperCase()
              );
              poolWithStatus.push({
                ...pool,
                current_price: tokenPrice && Number(tokenPrice.current_price),
                current_usd_value:
                  tokenPrice &&
                  Number(tokenPrice.current_price * pool.total_sold_coin),
                orignal_usd_value: isNumber(Number(pool.token_price))
                  ? Number(pool.total_sold_coin * pool.token_price)
                  : pool.token_price,
                current_roi:
                  tokenPrice &&
                  Number(tokenPrice.current_price / tokenPrice.ido_price),
                ath_roi:
                  +pool.ath_roi !== 0
                    ? +pool.ath_roi
                    : tokenPrice && Number(tokenPrice.ath_roi),
                status: pool.campaign_status || pool.campaignStatus,
              });
            }
          })
          .catch((e) => {
            console.log("ERROR analytic", e);
            for (let i = 0; i < listData.length; i++) {
              const pool = { ...listData[i] };
              poolWithStatus.push({
                ...pool,
                status: pool.campaign_status || pool.campaignStatus,
              });
            }
          });
      }

      poolsList.data = poolWithStatus;
      listData = poolWithStatus;

      setPools(listData);
    };

    if (poolsList && poolsList.data) {
      manipulatePoolsData();
    }
  }, [poolsList, appChain, connector]);

  const renderTable = () => {
    if (loadingGetPool)
      return (
        <div className={styles.tableLoading}>
          <LoadingTable />
        </div>
      );
    if (isMobile) {
      return (
        <div className={styles.tableMobileContainer}>
          {pools.length > 0 &&
            pools.map((pool: any, index: number) => {
              return <CardCompletedSales pool={pool} key={index} />;
            })}
        </div>
      );
    }
    return (
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table className={styles.table} aria-label="simple table">
          <TableBody>
            {pools.length > 0 &&
              pools.map((pool: any, index: number) => {
                return <IdoPoolCard pool={pool} key={index} />;
              })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <>
      <div className={styles.poolsContainer}>
        <div className={styles.listPoolHeader}>
          <span className={styles.listPoolTitle}>List View</span>
          <button
            className={styles.btnCalender}
            onClick={() => history.push("/calendar")}
          >
            <Image width={23} height={23} src="/assets/images/icons/calendar.svg" alt="" />
            Calendar view
          </button>
          <div className={styles.searchGroup}>
            <input
              type="text"
              placeholder="Search by Pool name, Token Symbol"
              className={commonStyle.nnn1424h}
              onChange={handleInputChange}
            />
            <Image width={24} height={23} src={iconSearch} alt="" />
          </div>

          <Select
            className={styles.selectBox}
            native
            IconComponent={ExpandMoreIcon}
            value={sort}
            onChange={handleSortChange}
            inputProps={{
              name: "sort",
              id: "sort-options",
            }}
          >
            <option value="" disabled>
              Select Sort Option
            </option>
            {sortOptions.map((item, index) => (
              <option value={item.value} key={index}>
                {item.babel}
              </option>
            ))}
          </Select>
        </div>

        {renderTable()}

        {totalPage > 1 && (
          <Pagination
            count={totalPage}
            shape="rounded"
            style={{ marginTop: 30 }}
            className={styles.pagination}
            onChange={(e: any, value: any) => {
              if (!loadingGetPool) {
                setCurrentPage(value);
              }
            }}
            page={currentPage}
            renderItem={(item: any) => (
              <PaginationItem className="pagination-item" {...item} />
            )}
          />
        )}
      </div>
    </>
  );
};

export default Pools;
