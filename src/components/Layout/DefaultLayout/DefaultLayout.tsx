import React from "react";
import MainDefaultLayout from "../../Base/MainDefaultLayout";

import FooterDefaultLayout from "../../Base/FooterDefaultLayout";
import commonStyle from '@/styles/commonstyle.module.scss'
import HeaderDefaultLayout from "@/components/Base/HeaderDefaultLayout/HeaderDefaultLayout";

type LayoutProps = {
  isDashboard?: boolean | undefined;
  isEvent?: boolean | undefined;
  isBuyToken?: boolean | undefined;
  isKYC?: boolean | undefined;
  children?: any;
  isShowFooter?: any;
};

const DefaultLayout = (props: LayoutProps) => {
  const { isDashboard = false, children, isEvent = false, isBuyToken = false, isShowFooter = true } = props;

  return (
    <div className={commonStyle.DefaultLayout}>
      <div
        className={`${commonStyle.bgBody} ${
          isDashboard ? commonStyle.dashboardLayout : ""
        } ${isEvent ? commonStyle.eventLayout : ""}
          ${isBuyToken ? commonStyle.buyTokenLayout : ""}`}
      >
        <HeaderDefaultLayout />
        <MainDefaultLayout>{children}</MainDefaultLayout>
        {isShowFooter && <FooterDefaultLayout />}
      </div>
    </div>
  );
};

export default DefaultLayout;
