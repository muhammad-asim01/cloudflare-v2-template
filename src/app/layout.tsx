import type { Metadata } from "next";
import "./globals.css";
import { headers } from "next/headers";
import ContextProvider from "@/context";
import '../styles/global.scss';
import { getConfigData } from "@/utils/landingConfig";


// export const metadata: Metadata = {
//   title: 'DegenPad: Launchpad for Dynamic IDOs - Powered by ChainGPT Labs',
//   description:
//     "Powered by latest technology developed by ChainGPT, DegenPad isn't just another IDO (Initial DEX Offering) Launchpad platform - it's where degens find their edge.",
//   openGraph: {
//     title: 'DegenPad: Launchpad for Dynamic IDOs - Powered by ChainGPT Labs.',
//     description:
//       "Powered by latest technology developed by ChainGPT, DegenPad isn't just another IDO (Initial DEX Offering) Launchpad platform - it's where degens find their edge.",
//     url: 'https://www.degenpad.com',
//     type: 'article',
//     images: ['/assets/images/landing/pad.png'],
//   },
//   icons: {
//     icon: '/assets/images/icon-logo.png',
//     shortcut: '/assets/images/favicons/favicon-32x32.png',
//     apple: [
//       { url: '/assets/images/favicons/apple-icon.png' },
//       { url: '/assets/images/favicons/apple-icon-144x144.png', sizes: '144x144' },
//     ],
 
//     other: [
//       {
//         rel: 'android-chrome',
//         sizes: 'any',
//         url: '/assets/images/favicons/android-icon-192x192.png',
//       },
//         {
//             rel: 'msapplication-TileImage',
//             url: '/assets/images/favicons/ms-icon-70x70.png',
//             sizes: '70x70',
//         },
//         {
//             rel: 'msapplication-TileImage',
//             url: '/assets/images/favicons/ms-icon-144x144.png',
//             sizes: '144x144',
//         },
//         {
//             rel: 'msapplication-TileImage',
//             url: '/assets/images/favicons/ms-icon-150x150.png',
//             sizes: '150x150',
//         },
//         {
//             rel: 'msapplication-TileImage',
//             url: '/assets/images/favicons/ms-icon-310x310.png',
//             sizes: '310x310',
//         },
//     ]
//   },
// };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersData = await headers();
  const cookies = headersData.get("cookie");

  const landingConfigData = await getConfigData();
  return (
    <html lang="en">
      <body>
        <ContextProvider initialConfigData={landingConfigData?.data || []} cookies={cookies}>{children}</ContextProvider>
      </body>
    </html>
  );
}



// make refrence to style the the pages which have not set correctly and fixed it based on this
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>


// type LayoutProps = {
//   isDashboard?: boolean | undefined;
//   isEvent?: boolean | undefined;
//   isBuyToken?: boolean | undefined;
//   isKYC?: boolean | undefined;
//   children?: any;
//   isShowFooter?: any;
// };

// const DefaultLayout = (props: LayoutProps) => {
//   const { isDashboard = false, children, isEvent = false, isBuyToken = false, isShowFooter = true } = props;

//   return (
//     <div className={commonStyle.DefaultLayout}>
//       <div
//         className={`${commonStyle.bgBody} ${
//           isDashboard ? commonStyle.dashboardLayout : ""
//         } ${isEvent ? commonStyle.eventLayout : ""}
//           ${isBuyToken ? commonStyle.buyTokenLayout : ""}`}
//       >
//         <HeaderDefaultLayout />
//         <MainDefaultLayout>{children}</MainDefaultLayout>
//         {isShowFooter && <FooterDefaultLayout />}
//       </div>
//     </div>
//   );
// };


