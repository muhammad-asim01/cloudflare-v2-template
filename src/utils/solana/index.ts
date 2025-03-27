import { PublicKey } from "@solana/web3.js";

export const FormatWalletAddress = (publicKey: PublicKey, charactesToShow: number) : string => {
    if(!publicKey) {
        return "";
    }
    const address = publicKey?.toBase58();
    const length = address.length;
    const startingChars = address.substring(0, charactesToShow);
    const lastChars = address.substring(length - charactesToShow, length);
    const formattedAddress = startingChars + "********" + lastChars;
    return formattedAddress;
}

export const FormatStringWalletAddress = (publicKey: string, charactesToShow: number) : string => {
    if(!publicKey) {
        return "";
    }
    const address = publicKey;
    const length = address.length;
    const startingChars = address.substring(0, charactesToShow);
    const lastChars = address.substring(length - charactesToShow, length);
    const formattedAddress = startingChars + "********" + lastChars;
    return formattedAddress;
}

export const FormatWalletAddressDots = (publicKey: PublicKey, charactesToShow: number) : string => {
    if(!publicKey) {
        return "";
    }
    const address = publicKey?.toBase58();
    const length = address.length;
    const startingChars = address.substring(0, charactesToShow);
    const lastChars = address.substring(length - charactesToShow, length);
    const formattedAddress = startingChars + "..." + lastChars;
    return formattedAddress;
}