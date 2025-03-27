'use client'

/* import { useState, useEffect } from 'react'; */
/* import useFetch from '@/hooks/useFetch'; */
import { Tier } from '@/hooks/usePoolDetails';
import { convertTimeToStringFormat } from '@/utils/convertDate';

/* import Tooltip from '@mui/material/Tooltip'; */
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import styles from '@/styles/myTier.module.scss'
import TierTableWithWeightRate from "./TierTableWithWeightRate";

type MyTierProps = {
  tiers: Tier[] | undefined,
  poolDetails: any,
}

const headers = ['Tier', 'Allocation (%)', 'Start Buy Time', 'End Buy Time'];

const MyTier: React.FC<MyTierProps> = ({ tiers, poolDetails }: MyTierProps) => {
  const poolPickWeight = [27, 33, 860, 31];
  const isPickeWeight = poolPickWeight.includes(poolDetails.id);// poolDetails.id == poolPickWeight;

  return (
    <div className={styles.MyTier}>
      {/* <p className={styles.MyTierAccountRedirect}> */}
      {/*   To upgrade your tier, please click <Link to="/account" style={{ color: '#6399FF', textDecoration: 'underline' }}>here</Link> ! */}
      {/* </p> */}
      <p className={styles.MyTierRulesHeader}>
        At current tier, you will be able to purchase with the following rules:
      </p>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table className={styles.table} aria-label="simple table">
            <TableHead className={styles.tableHeaderWrapper}>
              <TableRow>
              {
                headers.map(header => (
                  <TableCell key={header} className={styles.tableHeader}>
                    <span>
                      {header}
                    </span>
                  </TableCell>
                ))
              }
              </TableRow>
            </TableHead>
            <TableBody>
              {!isPickeWeight &&
                <>
                  {tiers && tiers.length> 0 && tiers.map((row: any, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {row.allocation}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {!row.startTime && '--'}
                        {row.startTime &&convertTimeToStringFormat(new Date(row.startTime * 1000))}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {!row.endTime && '--'}
                        {row.endTime && convertTimeToStringFormat(new Date(row.endTime * 1000))}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              }

              {isPickeWeight &&
                tiers && tiers.length > 0 && (
                  <TierTableWithWeightRate
                    tiers={tiers}
                  />
                )
              }

            </TableBody>
            </Table>
        </TableContainer>
    </div>
  )
}

export default MyTier;
