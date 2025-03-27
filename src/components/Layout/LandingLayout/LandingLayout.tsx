import FooterDefaultLayout from "@/components/Base/FooterDefaultLayout";
import HeaderDefaultLayout from "@/components/Base/HeaderDefaultLayout/HeaderDefaultLayout";
import MainDefaultLayout from "@/components/Base/MainDefaultLayout";
import commonStyle from '@/styles/commonstyle.module.scss'


const LandingLayout = (props: any) => {

  return (
    <div
      className={commonStyle.DefaultLayout}
      style={{ background: "#020618" }}
    >
      <div
        style={{
          background: "rgb(6,3,13)",
          position: "absolute",
          width: "100%",
        }}
      >
        <HeaderDefaultLayout />
        {/* <HeaderLandingLayout/> */}
      </div>
      <MainDefaultLayout backgroundColor="#020618">
        {props.children}
      </MainDefaultLayout>
      <FooterDefaultLayout />
    </div>
  );
};

export default LandingLayout;
