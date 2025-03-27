import { useTheme } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

const useResponsive = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isMobileUp = useMediaQuery(theme.breakpoints.down("sm")); // <600px
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md")); // 600px - 899px
  const isLaptop = useMediaQuery(theme.breakpoints.between("md", "lg")); // 900px - 1199px
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg")); // >1200px

  return { isMobile, isTablet, isLaptop, isDesktop,isMobileUp };
};

export default useResponsive;
