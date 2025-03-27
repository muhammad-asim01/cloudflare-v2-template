import React from "react";
import NotFound from "../../components/Base/404/NotFound";

import { Metadata } from "next";
import HeaderDefaultLayout from "@/components/Base/HeaderDefaultLayout/HeaderDefaultLayout";
// export const metadata: Metadata = {
//   title: 'DegenPad: Launchpad for Dynamic IDOs - Powered by ChainGPT Labs',
//   description:
//     "Powered by latest technology developed by ChainGPT, DegenPad isn't just another IDO (Initial DEX Offering) Launchpad platform - it's where degens find their edge.",
// }

const NotFoundPage = () => {
  return (
    <>
      <HeaderDefaultLayout />
      <NotFound
        title="Oops! The page you're trying to access is not available."
        description="The page you are looking for doesn't exist or has been moved"
        url="/"
        buttonLink="Back to Home Page"
      />
    </>
  );
};

export default NotFoundPage;
