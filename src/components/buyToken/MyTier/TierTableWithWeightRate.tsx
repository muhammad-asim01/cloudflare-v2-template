import React from 'react';
import TableCell from "@mui/material/TableCell";
import {convertTimeToStringFormat} from "@/utils/convertDate";
import TableRow from "@mui/material/TableRow";
import BigNumber from 'bignumber.js';


const NormalRow = ({row}: any) => {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {row?.name}
      </TableCell>
      <TableCell component="th" scope="row">
        {row?.allocation}
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
  );
};

const GroupRow = ({ sliver, gold, diamond }: any) => {
  const totalAllowcation = new BigNumber(sliver?.allocation || 0)
    .plus(gold?.allocation || 0)
    .plus(diamond?.allocation || 0)
    .toFixed(2);

  return (
    <>
      <TableRow>
        <TableCell component="th" scope="row">
          {sliver?.name}
        </TableCell>
        <TableCell component="th" scope="row" rowSpan={3} style={{
          borderRight: '1px solid rgba(255, 255, 255, 0.1)',
          borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          {totalAllowcation}
        </TableCell>
        <TableCell component="th" scope="row">
          {!sliver.startTime && '--'}
          {sliver.startTime && convertTimeToStringFormat(new Date(sliver.startTime * 1000))}
        </TableCell>
        <TableCell component="th" scope="row">
          {!sliver.endTime && '--'}
          {sliver.endTime && convertTimeToStringFormat(new Date(sliver.endTime * 1000))}
        </TableCell>
      </TableRow>


      <TableRow>
        <TableCell component="th" scope="row">
          {gold?.name}
        </TableCell>

        <TableCell component="th" scope="row">
          {!gold.startTime && '--'}
          {gold.startTime && convertTimeToStringFormat(new Date(gold.startTime * 1000))}
        </TableCell>
        <TableCell component="th" scope="row">
          {!gold.endTime && '--'}
          {gold.endTime && convertTimeToStringFormat(new Date(gold.endTime * 1000))}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell component="th" scope="row">
          {diamond?.name}
        </TableCell>

        <TableCell component="th" scope="row">
          {!diamond.startTime && '--'}
          {diamond.startTime && convertTimeToStringFormat(new Date(diamond.startTime * 1000))}
        </TableCell>
        <TableCell component="th" scope="row">
          {!diamond.endTime && '--'}
          {diamond.endTime && convertTimeToStringFormat(new Date(diamond.endTime * 1000))}
        </TableCell>
      </TableRow>

    </>
  );

};

function TierTableWithWeightRate(props: any) {
  const { tiers } = props;
  return (
    <>
      <NormalRow row={tiers[0]} />
      <NormalRow row={tiers[1]} />
      <GroupRow
        sliver={tiers[2]}
        gold={tiers[3]}
        diamond={tiers[4]}
      />
    </>
  );
}

export default TierTableWithWeightRate;
