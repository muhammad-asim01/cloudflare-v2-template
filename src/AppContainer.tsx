import BigNumber from 'bignumber.js';
import React from 'react';
BigNumber.config({ EXPONENTIAL_AT: 50 });
BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
  
const AppContainer = (props: any) => {

  return (
    <>
      {props.children}
    </>
  );
};

export default AppContainer;
