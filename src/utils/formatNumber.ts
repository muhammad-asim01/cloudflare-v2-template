import BigNumber from 'bignumber.js';
import removeTrailingZeros from 'remove-trailing-zeros'
import commaNumber from 'comma-number';

const ARROW_LEFT_KEY_CODE = 37;
const ARROW_RIGHT_KEY_CODE = 39;
const BACKSPACE_KEY_CODE = 8;
const DELETE_KEY_CODE = 46;
export const DECIMAL_KEY_CODE = 190;

const A_KEY_CODE = 65;
const V_KEY_CODE = 86;
const C_KEY_CODE = 67;

const START_NUMBER_KEY_CODE = 48;
const END_NUMBER_KEY_CODE = 57;

export const INTEGER_NUMBER_KEY_CODE_LIST = [ARROW_LEFT_KEY_CODE, ARROW_RIGHT_KEY_CODE, BACKSPACE_KEY_CODE, DELETE_KEY_CODE];
export const FLOAT_NUMBER_KEY_CODE_LIST = [...INTEGER_NUMBER_KEY_CODE_LIST, DECIMAL_KEY_CODE];

export const formatToNumber = (yourNumber: any) => {
  if (yourNumber && !isNaN(Number(yourNumber))) {
    const yourNumberBig = new BigNumber(yourNumber).toString();
    if (yourNumberBig.length !== yourNumber.length) {
      return yourNumberBig;
    }
    return yourNumber;
  }
  return yourNumber;
};

export const getShortNumberBuyDecimals = (balance: any, decimals: number = 8) => {
  const balanceNumber = new BigNumber(balance).toString();
  if (balanceNumber.includes('.')) {
    const balanceSplit = balance.toString().split('.');
    const decimalsString = balanceSplit.pop();
    if (decimalsString.length > decimals) {
      return new BigNumber(balance).toFormat(decimals);
    }
    return new BigNumber(balance).toFormat();;
  }
  
  return new BigNumber(balance).toFormat();;
};

export const checkNumberByASCIIC = (event: any, isNotFloatNumber: boolean = false) => {
  const keyCode = event.keyCode || event.which;
  
  const keyCodeList = isNotFloatNumber ? INTEGER_NUMBER_KEY_CODE_LIST : FLOAT_NUMBER_KEY_CODE_LIST;
  if (keyCodeList.includes(keyCode)) {
    return true;
  }
  
  // Allow: Ctrl+A,Ctrl+C,Ctrl+V, Command+A
  if ((keyCode === A_KEY_CODE || keyCode === V_KEY_CODE || keyCode === C_KEY_CODE) && (event.ctrlKey === true || event.metaKey === true)) {
    return true;
  }
  
  if (event.shiftKey) {
    return false;
  }
  
  if (keyCode < START_NUMBER_KEY_CODE || keyCode > END_NUMBER_KEY_CODE) {
    return false;
  }
  
  return true;
};

export const isNotValidASCIINumber = (keyCode: number, decimalRequired: boolean = false) => {
  const abnormalKeys = [ARROW_LEFT_KEY_CODE, ARROW_RIGHT_KEY_CODE, A_KEY_CODE, C_KEY_CODE, V_KEY_CODE];
  
  if (decimalRequired) {
    abnormalKeys.push(DECIMAL_KEY_CODE);
  }
  
  if (abnormalKeys.indexOf(keyCode) >= 0) {
    return false;
  }
  
  if (keyCode === 229) {
    return true;
  }
  
  return keyCode > 31 && (keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105);
};

export const isPreventASCIICharacters = (key: string) => {
  const abnormalKeys = ['arrowleft', 'arrowright', 'control', 'a', 'c', 'v'];
  return abnormalKeys.indexOf(key.toLowerCase()) >= 0;
};

export const replaceSpecialCharactersCopy = (str: string) => {
  return str.replaceAll(/[.,\s\D]*/g, '');
}

export const trimLeadingZeros = (input: string): string => {
  return input.replace(/^0+/, '');
}

export const trimEndingZeros = (input: string): string => {
  return input.replace(/0+$/, '');
}

export const trimLeadingZerosWithDecimal = (input: string): string => {
  
  if (input.includes('.')) {
    let trimEndingZerosString: string = '';
    
    if (input.startsWith('0.')) {
      trimEndingZerosString = trimEndingZeros(input);
    } else if (input.match(/^0{2,}\./)) {
      trimEndingZerosString = `0${trimEndingZeros(trimLeadingZeros(input))}`
    } else {
      trimEndingZerosString = trimEndingZeros(trimLeadingZeros(input))
    }
    
    if (trimEndingZerosString.length > 0 && trimEndingZerosString.endsWith('.')) {
      return trimEndingZerosString.split('').slice(0, -1).join('');
    }
    
    return trimEndingZerosString;
  }
  
  return trimLeadingZeros(input);
};

export const getDigitsAfterDecimals = (input: string): number => {
  let totalDigits = 0;
  
  if (input.includes('.')) {
    const splittedDecimals = input.slice(input.indexOf('.') + 1, input.length);
    
    totalDigits = splittedDecimals.length;
  }
  
  return totalDigits;
}

export function numberWithCommas(
  x: string | number | null | undefined = "",
  decimals: number = 2,
  ceil: boolean = false
) {
  if (x === null || x === undefined) {
    // Handle the case where x is null or undefined
    return "";
  }
  x = typeof x === "string" ? x : (x as number).toFixed();
  if (ceil) {
    return removeTrailingZeros(
      commaNumber(Math.round(parseFloat(x)), ",", ".")
    );
  }
  return removeTrailingZeros(
    commaNumber(new BigNumber(x).toFixed(decimals), ",", ".")
  );
  // }
  
  // return format(x);
}

export function roundOff(input: string | number): string {
  // Ensure the input is a number, converting from string if necessary
  const number: number = typeof input === "string" ? parseFloat(input) : input;
  
  // Convert the number to a string after rounding it
  const roundedStr: string = Math.round(number).toString();
  
  // Check if the last digit is 9 and adjust the number accordingly
  if (roundedStr.endsWith('9')) {
    // Directly return the incremented number as a string
    return (parseInt(roundedStr) + 1).toString();
  } else {
    // Return the rounded number as is if it doesn't end in 9
    return roundedStr;
  }
}

export const nFormatter = (number: string, digits: any = 0) => {
  const SI = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const num = parseFloat(number)
  let i;
  for (i = SI.length - 1; i > 0; i--) {
    if (num >= SI[i].value) {
      break;
    }
  }
  return (num / SI[i].value).toFixed(digits).replace(rx, "$1") + SI[i].symbol;
}

export const formatRoundDown = (num: any, decimals = 8) => {
  return new BigNumber(num)
    .decimalPlaces(decimals, BigNumber.ROUND_DOWN)
    .toFixed(decimals, BigNumber.ROUND_DOWN);
};

export const formatRoundUp = (num: any, decimals = 8) => {
  return new BigNumber(num)
    .decimalPlaces(decimals, BigNumber.ROUND_UP)
    .toFixed(decimals, BigNumber.ROUND_UP);  // ROUND_UP: 4.999999999999999999987744 --> 5
};


export const formatRoundHalfDown = (num: any, decimals = 8) => {
  return new BigNumber(num)
    .decimalPlaces(decimals, BigNumber.ROUND_HALF_DOWN)
    .toFixed(decimals, BigNumber.ROUND_HALF_DOWN);
};

export const formatRoundHalfUp = (num: any, decimals = 8) => {
  return new BigNumber(num)
    .decimalPlaces(decimals, BigNumber.ROUND_HALF_UP)
    .toFixed(decimals, BigNumber.ROUND_HALF_UP);
};

export const customRound= (value: any) => {
  // Separate the value into its integer and decimal parts
  const integerPart = Math.floor(value);
  const decimalPart = value - integerPart;

  // Check if the decimal part is 0.5 or more
  if (decimalPart >= 0.5) {
    // If so, round up by adding 1 to the integer part
    return (integerPart + 1).toString();
  } else {
    // Otherwise, return the original integer part without the decimal
    return value.toFixed(2);
  }
}


