"use client";

import {
  wagmiAdapter,
  solanaWeb3JsAdapter,
  projectId,
  networks,
} from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider } from "wagmi";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "@mui/material";
import configureStore from "@/store/configureStore";
import defaultTheme from "@/themes/DefaultTheme/DefaultTheme";
import RoutesConfigProvider from "@/providers/RoutesProvider";

// Set up queryClient
const queryClient = new QueryClient();

// Set up metadata
const metadata = {
  name: "next-reown-appkit",
  description: "next-reown-appkit",
  url: "https://github.com/0xonerb/next-reown-appkit-ssr", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/179229932"],
};

import commonStyle from "@/styles/commonstyle.module.scss";
import HeaderDefaultLayout from "@/components/Base/HeaderDefaultLayout/HeaderDefaultLayout";
import MainDefaultLayout from "@/components/Base/MainDefaultLayout";
import FooterDefaultLayout from "@/components/Base/FooterDefaultLayout";
// Create the modal
export const modal = createAppKit({
  adapters: [wagmiAdapter, solanaWeb3JsAdapter],
  projectId,
  networks,
  metadata,
  themeMode: "light",
  features: {
    analytics: true,
  },
  themeVariables: {
    "--w3m-accent": "#000000",
  },
});

function ContextProvider({
  children,
  cookies,
  initialConfigData,
}: Readonly<{
  children: ReactNode;
  cookies: string | null;
  initialConfigData:any
}>) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig, cookies);

  const { store, persistor } = configureStore();

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={defaultTheme}>
            <div className={commonStyle.DefaultLayout}>
          <div
            className={`${commonStyle.bgBody} ${commonStyle.dashboardLayout}`}
          >
            <HeaderDefaultLayout />
            <MainDefaultLayout>
              <RoutesConfigProvider initialConfigData={initialConfigData}>{children}</RoutesConfigProvider>
      
              </MainDefaultLayout>
            <FooterDefaultLayout />
          </div>
        </div>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
