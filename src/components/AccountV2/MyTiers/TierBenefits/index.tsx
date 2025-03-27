'use client'

import {
  Hidden,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { numberWithCommas } from "@/utils/formatNumber";
import styles from '@/styles/tierBenefit.module.scss'
import { useSelector } from "react-redux";

import Image from "next/image";




const bronzeIcon = "/assets/images/icons/bronze.png";
const sliverIcon = "/assets/images/icons/silver.png";
const goldIcon = "/assets/images/icons/gold.png";
const diamondIcon = "/assets/images/icons/diamond.png";

const TierBenefits = ( ) => {
  const configData: any = useSelector((store: any) => store?.config?.data);

  return (
    <div className={styles.tabTierBenefits}>
      <Hidden smDown>
        <TableContainer component={Paper} className={styles.tableContainer}>
          <Table className={styles.table} aria-label="simple table">
            <TableHead className={styles.tableHeaderWrapper}>
              <TableRow>
                <TableCell>Tier Benefits</TableCell>
                <TableCell className={styles.tierHeader} align="right">
                  <Image alt="tiers-icons" width={20} height={20} style={{ marginRight: 15 }} src={bronzeIcon} />
                  <p>Ape</p></TableCell>
                <TableCell className={styles.tierHeader} align="right">
                  <Image alt="tiers-icons" width={20} height={20} style={{ marginRight: 12 }} src={sliverIcon} />
                  <p>Chad</p></TableCell>
                <TableCell className={styles.tierHeader} align="right">
                  <Image alt="tiers-icons" width={20} height={20} style={{ marginRight: 9 }} src={goldIcon} />
                  <p>Shark</p></TableCell>
                <TableCell className={styles.tierHeader} align="right">
                  <Image alt="tiers-icons" width={20} height={20} style={{ marginRight: 22 }} src={diamondIcon} />
                  <p>Whale</p></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            {configData?.myTiers?.TierBenefits?.length > 0 ? configData?.data?.myTiers?.TierBenefits.map((tier, index) => {
                return <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {tier?.title || 'Minimum Staking Points'}
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    {tier?.bronze_checked ? (tier?.bronze ||
                        //  <i className="material-icons" style={{color: "green"}}>check</i>) : "-"}{/* {numberWithCommas("2000")} */}
                        <Image alt="tiers-icons" width={20} height={20} src="/assets/images/account_v3/icons/icon_table_true.svg" />) : "-"}
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    {/* {numberWithCommas("20000")} */}
                    {tier?.silver_checked ? (tier?.silver ||
                        //  <i className="material-icons" style={{color: "green"}}>check</i>) : "-"}
                        <Image alt="tiers-icons" width={20} height={20} src="/assets/images/account_v3/icons/icon_table_true.svg" />) : "-"}
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    {/* {numberWithCommas("50000")} */}
                    {tier?.gold_checked ? (tier?.gold ||
                        //  <i className="material-icons" style={{color: "green"}}>check</i>) : "-"}
                        <Image alt="tiers-icons" width={20} height={20} src="/assets/images/account_v3/icons/icon_table_true.svg" />) : "-"}
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    {/* {numberWithCommas("200000")} */}
                    {tier?.diamond_checked ? (tier?.diamond ||
                        //  <i className="material-icons" style={{color: "green"}}>check</i>) : "-"}
                        <Image alt="tiers-icons" width={20} height={20} src="/assets/images/account_v3/icons/icon_table_true.svg" />) : "-"}
                  </TableCell>
                </TableRow>
              }): configData?.myTiers?.TierBenefits.map((tier, index) => {
                return <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {tier?.title || 'Minimum Staking Points'}
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    {tier?.bronze}{/* {numberWithCommas("2000")} */}
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    {/* {numberWithCommas("20000")} */}
                    {tier?.silver}
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    {/* {numberWithCommas("50000")} */}
                    {tier?.gold}
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    {/* {numberWithCommas("200000")} */}
                    {tier?.diamond}
                  </TableCell>
                </TableRow>
              })}
              {/* <TableRow>
                <TableCell component="th" scope="row">
                  Pool Weight / Allocation Multiplier
                </TableCell>
                <TableCell component="th" scope="row" align="right">
                  1x
                </TableCell>
                <TableCell component="th" scope="row" align="right">
                  4x
                </TableCell>
                <TableCell component="th" scope="row" align="right">
                  10x
                </TableCell>
                <TableCell component="th" scope="row" align="right">
                  40x
                </TableCell>
              </TableRow> */}
              {/* {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    <Image alt="tiers-icons" width={20} height={20}
                      src={`/assets/images/account_v3/icons/icon_table_${row.bronze === 0 ? "false" : "true"
                        }.svg`}
                      alt=""
                    />
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    <Image alt="tiers-icons" width={20} height={20}
                      src={`/assets/images/account_v3/icons/icon_table_${row.silver === 0 ? "false" : "true"
                        }.svg`}
                      alt=""
                    />
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    <Image alt="tiers-icons" width={20} height={20}
                      src={`/assets/images/account_v3/icons/icon_table_${row.gold === 0 ? "false" : "true"
                        }.svg`}
                      alt=""
                    />
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    <Image alt="tiers-icons" width={20} height={20}
                      src={`/assets/images/account_v3/icons/icon_table_${row.diamond === 0 ? "false" : "true"
                        }.svg`}
                      alt=""
                    />
                  </TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Hidden>

      <Hidden mdUp>
        <div className={styles.tierBenefitsMobile}>
        {configData?.myTiers?.TierBenefits?.length > 0 ? configData?.data?.myTiers?.TierBenefits.map((tier, index) => {
            return <TableContainer component={Paper} className={styles.tableContainer} key={index}>


              <h2>{tier?.title}</h2>
              <Table className={styles.table} aria-label="simple table">
                <TableHead className={styles.tableHeaderWrapper}>
                  <TableRow>
                    <TableCell className={styles.tierHeader} align="right">Ape</TableCell>
                    <TableCell className={styles.tierHeader} align="right">Chad</TableCell>
                    <TableCell className={styles.tierHeader} align="right">Shark</TableCell>
                    <TableCell className={styles.tierHeader} align="right">Whale</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" align="right">
                      {numberWithCommas("2000")}
                      {tier?.bronze}
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      {numberWithCommas("20000")}
                      {tier?.silver}
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      {numberWithCommas("50000")}
                      {tier?.gold}
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      {numberWithCommas("200000")}
                      {tier?.diamond}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          }): configData?.myTiers?.TierBenefits.map((tier, index) => {
            return <TableContainer component={Paper} className={styles.tableContainer} key={index}>


              <h2>{tier?.title}</h2>
              <Table className={styles.table} aria-label="simple table">
                <TableHead className={styles.tableHeaderWrapper}>
                  <TableRow>
                    <TableCell className={styles.tierHeader} align="right">Ape</TableCell>
                    <TableCell className={styles.tierHeader} align="right">Chad</TableCell>
                    <TableCell className={styles.tierHeader} align="right">Shark</TableCell>
                    <TableCell className={styles.tierHeader} align="right">Whale</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" align="right">
                      {numberWithCommas("2000")}
                      {tier?.bronze}
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      {numberWithCommas("20000")}
                      {tier?.silver}
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      {numberWithCommas("50000")}
                      {tier?.gold}
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      {numberWithCommas("200000")}
                      {tier?.diamond}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          })}

          {/* <TableContainer component={Paper} className={styles.tableContainer}>
            <h2>Pool Weight / Allocation Multiplier</h2>
            <Table className={styles.table} aria-label="simple table">
              <TableHead className={styles.tableHeaderWrapper}>
                <TableRow>
                  <TableCell className={styles.tierHeader} align="right">Bronze</TableCell>
                  <TableCell className={styles.tierHeader} align="right">Silver</TableCell>
                  <TableCell className={styles.tierHeader} align="right">Gold</TableCell>
                  <TableCell className={styles.tierHeader} align="right">Diamond</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" align="right">
                    1x
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    4x
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    10x
                  </TableCell>
                  <TableCell component="th" scope="row" align="right">
                    40x
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          {rows.map((row) => (
            <TableContainer component={Paper} className={styles.tableContainer}>
              <h2>{row.name}</h2>
              <Table className={styles.table} aria-label="simple table">
                <TableHead className={styles.tableHeaderWrapper}>
                  <TableRow>
                    <TableCell className={styles.tierHeader} align="right">Bronze</TableCell>
                    <TableCell className={styles.tierHeader} align="right">Silver</TableCell>
                    <TableCell className={styles.tierHeader} align="right">Gold</TableCell>
                    <TableCell className={styles.tierHeader} align="right">Diamond</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row" align="right">
                      <Image alt="tiers-icons" width={20} height={20}
                        src={`/assets/images/account_v3/icons/icon_table_${row.bronze === 0 ? "false" : "true"
                          }.svg`}
                        alt=""
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      <Image alt="tiers-icons" width={20} height={20}
                        src={`/assets/images/account_v3/icons/icon_table_${row.silver === 0 ? "false" : "true"
                          }.svg`}
                        alt=""
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      <Image alt="tiers-icons" width={20} height={20}
                        src={`/assets/images/account_v3/icons/icon_table_${row.gold === 0 ? "false" : "true"
                          }.svg`}
                        alt=""
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" align="right">
                      <Image alt="tiers-icons" width={20} height={20}
                        src={`/assets/images/account_v3/icons/icon_table_${row.diamond === 0 ? "false" : "true"
                          }.svg`}
                        alt=""
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ))} */}
        </div>
      </Hidden>
    </div>
  );
};

export default TierBenefits;
