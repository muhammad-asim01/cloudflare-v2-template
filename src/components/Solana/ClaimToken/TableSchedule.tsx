import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import React from "react";
import { CLAIM_TYPE } from "@/constants";
import styles from '@/styles/claimToken.module.scss'
import Image from "next/image";


const TableSchedule = (props: any) => {
  const { poolDetails, dataTable, websiteClaimTime } = props;

  if (websiteClaimTime) return <></>;

  const emptySchedule = !dataTable || dataTable.length < 1;
  if (emptySchedule) {
    return (
      <>
        <span>
          Token Claim Date & Time will be announced soon. Please stay tuned for
          updates.
        </span>
      </>
    );
  }
  return (
    <>
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table className={styles.table} aria-label="simple table">
          <TableHead className={styles.tableHeaderWrapper}>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>%</TableCell>
              <TableCell>Amount</TableCell>
              {(!poolDetails?.claimType ||
                poolDetails?.claimType === CLAIM_TYPE.CLAIM_ON_LAUNCHPAD) && (
                <TableCell></TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {dataTable.map((row: any, index: number) => {
              return (
                row.date && (
                  <TableRow key={index}>
                    <TableCell component="th" scope="row" width="50%">
                      {moment(row.date).format("HH:mm, DD MMM YYYY")}
                    </TableCell>
                    <TableCell component="th" scope="row" width="18%">
                      {row.percent.toFixed(2) || 0}%
                    </TableCell>
                    <TableCell component="th" scope="row" width="22%">
                      {row.tokenAmount.toFixed(2) || 0}
                    </TableCell>
                    {(!poolDetails?.claimType ||
                      poolDetails?.claimType ===
                        CLAIM_TYPE.CLAIM_ON_LAUNCHPAD ||
                      poolDetails?.claimType ===
                        CLAIM_TYPE.CLAIM_A_PART_OF_TOKENS_ON_LAUNCHPAD) && (
                      <TableCell component="th" scope="row" width="10%">
                        {row.marked && (
                          <Image width={24} height={24} src="/assets/images/icons/success.svg" alt="" />
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                )
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TableSchedule;
