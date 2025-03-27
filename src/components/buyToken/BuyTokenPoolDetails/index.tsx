'use client'

import { Tooltip } from "@mui/material";
import Skeleton from "@mui/lab/Skeleton";
import { FC, useRef, useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";
import {
  CLAIM_TYPE,
  CLAIM_TYPE_DESCRIPTION,
  CLAIM_TYPE_TEXT,
  NETWORK,
  NETWORK_SRC_ICON,
  NETWORK_TEXT,
  POOL_IS_PRIVATE,
  CUSTOM_NETWORK,
} from "@/constants";
import commonStyles from '@/styles/commonstyle.module.scss'

import { showTotalRaisePrice } from "@/utils/campaign";
import { numberWithCommas } from "@/utils/formatNumber";
import styles from '@/styles/buyTokenPoolDetails.module.scss'
import axios from "@/services/axios";
import InfoIcon from "@mui/icons-material/Info";
import CopyToClipboard from "react-copy-to-clipboard";
import { trimMiddlePartAddress } from "@/utils/accountAddress";
import Image from "next/image";

type Props = {
  poolDetails: any;
  currentUserTierLevel: number;
  currencyName: any;
};

// const headers = ["Tier", "Start Buy Time", "End Buy Time"];

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const BuyTokenPoolDetails: FC<Props> = ({
  poolDetails,
  currentUserTierLevel,
  currencyName,
}) => {
  const ref = useRef(null);
  // const [openModal, setOpenModal] = useState(false);
  const [showFull, setShowFull] = useState<boolean>(false);
  const [showTokenPrice, setShowTokenPrice] = useState<any>("");

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const loadingPool = !poolDetails;
  const claimType = poolDetails?.claimType ?? CLAIM_TYPE.CLAIM_ON_LAUNCHPAD;

  // const handleClose = () => {
  //   setOpenModal(false);
  // };
  useEffect(() => {
    setTimeout(() => {
      const videos = document.querySelectorAll(".cms-content iframe");
      const tables = document.querySelectorAll(".cms-content table");

      videos.forEach(function (elem) {
        const iframe: any = elem;
        const iframeWrapper = document.createElement("div");
        iframeWrapper.classList.add("responsive-iframe");
        iframe?.parentNode.insertBefore(iframeWrapper, iframe);
        iframeWrapper.appendChild(iframe);
      });

      tables.forEach(function (elem) {
        const table: any = elem;
        const tableWrapper = document.createElement("div");
        tableWrapper.classList.add("cms-table-wrap");
        table?.parentNode.insertBefore(tableWrapper, table);
        tableWrapper.appendChild(table);
      });
    }, 1000);
  }, []);

  useEffect(() => {
    getPoolsWithTokenPrice();
  }, [poolDetails]);

  async function getPoolsWithTokenPrice() {
    let poolWithTokenPrice = poolDetails;
    let symbolList = poolDetails?.tokenDetails.symbol;
    await axios
      .get(`${baseUrl}/token-price?page=0&search=${symbolList}`)
      .then((response) => {
        let tokenPrice = response.data.data.data.find(
          (dt: any) =>
            dt.token_symbol === poolDetails?.tokenDetails.symbol.toUpperCase()
        );
        let poolPrice = {
          current_price: tokenPrice && Number(tokenPrice.current_price),
          orignal_usd_value: Number(
            poolDetails.totalSoldCoin * poolDetails.token_price
          ),
          current_usd_value:
            tokenPrice &&
            Number(tokenPrice.current_price * poolDetails.totalSoldCoin),
        };
        setShowTokenPrice(poolPrice);
      })
      .catch((e) => {
        console.log("ERROR analytic", e);
      });
    return poolWithTokenPrice;
  }

  const getTextColor = () => {
    if (!poolDetails) return "";

    let className: string = "";
    switch (poolDetails.isPrivate) {
      case POOL_IS_PRIVATE.COMMUNITY:
        className = "text-yellow";
        break;
      case POOL_IS_PRIVATE.EVENT:
        className = "text-purple";
        break;
      default:
        className = "text-purple";
        break;
    }
    return className;
  };

  const getDimensions = (ele: any) => {
    const { height } = ele.getBoundingClientRect();
    const offsetTop = ele.offsetTop;
    const offsetBottom = offsetTop + height;

    return {
      height,
      offsetTop,
      offsetBottom,
    };
  };

  const scrollTo = (ele: any) => {
    const { height: navHeight } = getDimensions(
      document.querySelector("#stickyNavBlock")
    );
    const { height: tokenHeaderHeight } = getDimensions(
      document.querySelector("#buyTokenHeader")
    );
    const { height: navTabsHeight } = getDimensions(
      document.querySelector("#navTabs")
    );
    const offsetSum = navHeight + tokenHeaderHeight + navTabsHeight + 60;
    const yOffset = -offsetSum;
    const y = ele.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  const RenderIntroduction = () => {
    const [visibleSection, setVisibleSection] = useState("");

    const navRef = useRef(null);
    const productRef = useRef(null);
    const roadmapRef = useRef(null);
    const BusinessModelRef = useRef(null);
    const teamRef = useRef(null);
    const partnersAndInvestorsRef = useRef(null);
    const tokenMetricsRef = useRef(null);

    const sectionRefs = [
      { section: "Product", ref: productRef },
      { section: "Roadmap", ref: roadmapRef },
      { section: "BusinessModel", ref: BusinessModelRef },
      { section: "Team", ref: teamRef },
      { section: "PartnersAndInvestors", ref: partnersAndInvestorsRef },
      { section: "TokenMetrics", ref: tokenMetricsRef },
    ];

    useEffect(() => {
      const handleScroll = () => {
        const { height: navHeight } = getDimensions(navRef.current);
        const { height: tokenHeaderHeight } = getDimensions(
          document.querySelector("#buyTokenHeader")
        );
        const { height: navTabsHeight } = getDimensions(
          document.querySelector("#navTabs")
        );
        const topScreenOffset =
          navHeight + tokenHeaderHeight + navTabsHeight + 200;

        const scrollPosition = window.scrollY + topScreenOffset;

        const selected = sectionRefs.find(({ section, ref }) => {
          const ele = ref.current;
          if (ele) {
            const { offsetBottom, offsetTop } = getDimensions(ele);
            return scrollPosition > offsetTop && scrollPosition < offsetBottom;
          }
        });

        if (selected && selected.section !== visibleSection) {
          setVisibleSection(selected.section);
        } else if (!selected && visibleSection) {
          setVisibleSection("");
        }
      };

      handleScroll();
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, [visibleSection]);

    const MAX_LENGTH = 210;
    let showButton = false,
      shortText = "",
      description = poolDetails?.description,
      roadmap = poolDetails?.roadmap,
      businessModel = poolDetails?.businessModel,
      team = poolDetails?.team,
      partnersInvestors = poolDetails?.partnersInvestors,
      tokenMetrics = poolDetails?.tokenMetrics;
    /*if (!description) return <></>;*/

    //       <div className={styles.titleMain}>Project Introduction</div>

    return (
      <div ref={ref}>
        <div id="stickyNavBlock" className={styles.stickyNavBlock} ref={navRef}>
          <div className={styles.stickyNavWrap}>
            <div className={styles.stickyNav}>
              {description ? (
                <>
                  <button
                    className={
                      styles.stickyNavLink +
                      ` ${visibleSection === "Product" ? "selected" : ""}`
                    }
                    onClick={() => {
                      scrollTo(productRef.current);
                    }}
                  >
                    Intro
                  </button>
                </>
              ) : (
                ""
              )}

              {roadmap ? (
                <>
                  <button
                    className={
                      styles.stickyNavLink +
                      ` ${visibleSection === "Roadmap" ? "selected" : ""}`
                    }
                    onClick={() => {
                      scrollTo(roadmapRef.current);
                    }}
                  >
                    Roadmap
                  </button>
                </>
              ) : (
                ""
              )}

              {businessModel ? (
                <>
                  <button
                    className={
                      styles.stickyNavLink +
                      ` ${visibleSection === "BusinessModel" ? "selected" : ""}`
                    }
                    onClick={() => {
                      scrollTo(BusinessModelRef.current);
                    }}
                  >
                    Business model
                  </button>
                </>
              ) : (
                ""
              )}

              {team ? (
                <>
                  <button
                    className={
                      styles.stickyNavLink +
                      ` ${visibleSection === "Team" ? "selected" : ""}`
                    }
                    onClick={() => {
                      scrollTo(teamRef.current);
                    }}
                  >
                    Team
                  </button>
                </>
              ) : (
                ""
              )}

              {partnersInvestors ? (
                <>
                  <button
                    className={
                      styles.stickyNavLink +
                      ` ${
                        visibleSection === "PartnersAndInvestors"
                          ? "selected"
                          : ""
                      }`
                    }
                    onClick={() => {
                      scrollTo(partnersAndInvestorsRef.current);
                    }}
                  >
                    Partners and investors
                  </button>
                </>
              ) : (
                ""
              )}

              {tokenMetrics ? (
                <>
                  <button
                    className={
                      styles.stickyNavLink +
                      ` ${visibleSection === "TokenMetrics" ? "selected" : ""}`
                    }
                    onClick={() => {
                      scrollTo(tokenMetricsRef.current);
                    }}
                  >
                    Token Metrics
                  </button>
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        {description ? (
          <>
            <div id="Product" className={styles.descrSection} ref={productRef}>
              <h2
                className={
                  styles.sectionTitle +
                  ` ${visibleSection === "Product" ? "selected" : ""}`
                }
              >
                Intro
              </h2>
              <div className={`cms-content ${styles.cmsContent}`}>
                {ReactHtmlParser(description)}
              </div>
            </div>
          </>
        ) : (
          ""
        )}

        {roadmap ? (
          <>
            <div id="Roadmap" className={styles.descrSection} ref={roadmapRef}>
              <h2
                className={
                  styles.sectionTitle +
                  ` ${visibleSection === "Roadmap" ? "selected" : ""}`
                }
              >
                Roadmap
              </h2>
              <div className={`cms-content ${styles.cmsContent}`}>
                {ReactHtmlParser(roadmap)}
              </div>
            </div>
          </>
        ) : (
          ""
        )}

        {businessModel ? (
          <>
            <div
              id="BusinessModel"
              className={styles.descrSection}
              ref={BusinessModelRef}
            >
              <h2
                className={
                  styles.sectionTitle +
                  ` ${visibleSection === "BusinessModel" ? "selected" : ""}`
                }
              >
                Business Model
              </h2>
              <div className={`cms-content ${styles.cmsContent}`}>
                {ReactHtmlParser(businessModel)}
              </div>
            </div>
          </>
        ) : (
          ""
        )}

        {team ? (
          <>
            <div id="Team" className={styles.descrSection} ref={teamRef}>
              <h2
                className={
                  styles.sectionTitle +
                  ` ${visibleSection === "Team" ? "selected" : ""}`
                }
              >
                Team
              </h2>
              <div className={`cms-content ${styles.cmsContent}`}>
                {ReactHtmlParser(team)}
              </div>
            </div>
          </>
        ) : (
          ""
        )}

        {partnersInvestors ? (
          <>
            <div
              id="PartnersAndInvestors"
              className={styles.descrSection}
              ref={partnersAndInvestorsRef}
            >
              <h2
                className={
                  styles.sectionTitle +
                  ` ${
                    visibleSection === "PartnersAndInvestors" ? "selected" : ""
                  }`
                }
              >
                Partners And Investors
              </h2>
              <div className={`cms-content ${styles.cmsContent}`}>
                {ReactHtmlParser(partnersInvestors)}
              </div>
            </div>
          </>
        ) : (
          ""
        )}

        {tokenMetrics ? (
          <>
            <div
              id="TokenMetrics"
              className={styles.descrSection}
              ref={tokenMetricsRef}
            >
              <h2
                className={
                  styles.sectionTitle +
                  ` ${visibleSection === "TokenMetrics" ? "selected" : ""}`
                }
              >
                Token Metrics
              </h2>
              <div className={`cms-content ${styles.cmsContent}`}>
                {ReactHtmlParser(tokenMetrics)}
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    );
  };

  const renderTextLoading = () => {
    return (
      <Skeleton
        className={commonStyles.skeleton}
        variant="text"
        style={{ flex: 1 }}
      />
    );
  };

  const renderTotalRaiseTextLoading = () => {
    return (
      <li className={styles.itemListContent}>
        <span className={styles.nameItemListContent}>Total Raise</span>
        <Skeleton
          className={commonStyles.skeleton}
          variant="text"
          style={{ flex: 1 }}
        />
      </li>
    );
  };

  const renderTokenDetailsLeft = () => {
    return (
      <ul className={styles.listContent}>
        <li className={styles.itemListContent}>
          <span className={styles.nameItemListContent}>Price per token</span>
          {loadingPool ? (
            renderTextLoading()
          ) : (
            <span className={styles.detailItemListContent}>
              {!poolDetails?.display_token_price ? (
                "TBA"
              ) : (
                <>
                  {Number(poolDetails?.ethRate) > 0 ? (
                    <>
                      {poolDetails?.ethRate} {currencyName} per &nbsp;
                      {poolDetails?.tokenDetails?.symbol}
                    </>
                  ) : (
                    "TBA"
                  )}
                </>
              )}
            </span>
          )}
        </li>
        <li className={styles.itemListContent}>
          <span className={styles.nameItemListContent}>Swap Amount</span>
          {loadingPool ? (
            renderTextLoading()
          ) : (
            <span
              className={styles.detailItemListContent}
              style={{ textTransform: "capitalize" }}
            >
              {Number(poolDetails?.amount) > 0 ? (
                <>
                  {numberWithCommas(poolDetails?.amount.toString())}{" "}
                  {poolDetails?.tokenDetails?.symbol}
                </>
              ) : (
                "TBA"
              )}
            </span>
          )}
        </li>
        {loadingPool
          ? renderTotalRaiseTextLoading()
          : poolDetails?.website && (
              <li className={styles.itemListContent}>
                <span className={styles.nameItemListContent}>Total Raise</span>
                <span
                  className={`${
                    styles.detailItemListContent
                  } ${getTextColor()}`}
                >
                  {Number(poolDetails?.ethRate) > 0
                    ? showTotalRaisePrice(poolDetails)
                    : "TBA"}
                </span>
              </li>
            )}
        <li className={styles.itemListContent}>
          <span className={styles.nameItemListContent}>Claim Type</span>
          {loadingPool ? (
            renderTextLoading()
          ) : (
            <Tooltip
              classes={{ tooltip: styles.tooltip }}
              title={CLAIM_TYPE_DESCRIPTION[claimType]}
              arrow
              placement="top"
            >
              <span className={styles.detailItemListContent}>
                {CLAIM_TYPE_TEXT[claimType]}
              </span>
            </Tooltip>
          )}
        </li>
        <li className={styles.itemListContent}>
          <span className={styles.nameItemListContent}>Refund Term</span>
          <span className={styles.detailItemListContent}>
            {poolDetails?.refund_term ? (
              <span>{poolDetails?.refund_term}</span>
            ) : (
              "TBA"
            )}
          </span>
        </li>
        <li className={styles.itemListContent}>
          <span className={styles.nameItemListContent}>
            <span>IMC (excl. liq)</span>
            <Tooltip
              classes={{ tooltip: styles.tooltip }}
              title="Initial Market Capitalization"
              arrow
              placement="top"
            >
              <InfoIcon style={{ marginLeft: "5px", width: "18px" }} />
            </Tooltip>
          </span>
          <span className={styles.detailItemListContent}>
            {poolDetails?.initialCapitalization ? (
              <span>
                ${numberWithCommas(poolDetails?.initialCapitalization)}
              </span>
            ) : (
              "TBA"
            )}
          </span>
        </li>
        <li className={styles.itemListContent}>
          <span className={styles.nameItemListContent}>
            <span>Total IMC</span>
            <Tooltip
              classes={{ tooltip: styles.tooltip }}
              title="Total Initial Market Capitalization"
              arrow
              placement="top"
            >
              <InfoIcon style={{ marginLeft: "5px", width: "18px" }} />
            </Tooltip>
          </span>
          <span className={styles.detailItemListContent}>
            {poolDetails?.totalinitialCapitalization ? (
              <span>
                ${numberWithCommas(poolDetails?.totalinitialCapitalization)}
              </span>
            ) : (
              "TBA"
            )}
          </span>
        </li>
        <li className={styles.itemListContent}>
          <span className={styles.nameItemListContent}>
            <span>FDV</span>
            <Tooltip
              classes={{ tooltip: styles.tooltip }}
              title="Fully Diluted Valuation"
              arrow
              placement="top"
            >
              <InfoIcon style={{ marginLeft: "5px", width: "18px" }} />
            </Tooltip>
          </span>
          <span className={styles.detailItemListContent}>
            {poolDetails?.fullyDelutedValuation ? (
              <span>
                ${numberWithCommas(poolDetails?.fullyDelutedValuation)}
              </span>
            ) : (
              "TBA"
            )}
          </span>
        </li>
      </ul>
    );
  };

  const renderGiveawayTokenDetails = () => {
    return (
      <ul className={styles.listContent}>
        <li className={styles.itemListContent}>
          <span className={styles.nameItemListContent}>
            Total Giveaway Tokens
          </span>
          <span className={styles.detailItemListContent}>
            {poolDetails?.totalSoldCoin ? poolDetails?.totalSoldCoin : "TBA"}
          </span>
        </li>
        <li className={styles.itemListContent}>
          <span className={styles.nameItemListContent}>Original USD Value</span>
          <span className={styles.detailItemListContent}>
            {showTokenPrice?.orignal_usd_value
              ? "$" +
                numberWithCommas(
                  Math.floor(
                    Number(showTokenPrice?.orignal_usd_value)
                  ).toString()
                )
              : "TBA"}
          </span>
        </li>
        <li className={styles.itemListContent}>
          <span className={styles.nameItemListContent}>Current USD Value</span>
          <span className={styles.detailItemListContent}>
            {showTokenPrice?.current_usd_value
              ? "$" +
                numberWithCommas(
                  Math.floor(
                    Number(showTokenPrice?.current_usd_value)
                  ).toString()
                )
              : "TBA"}
          </span>
        </li>
        <li className={styles.itemListContent}>
          <span className={styles.nameItemListContent}>
            Original Token Price
          </span>
          <span className={styles.detailItemListContent}>
            {poolDetails.token_price
              ? numberWithCommas(poolDetails.token_price)
              : "TBA"}
          </span>
        </li>
        <li className={styles.itemListContent}>
          <span className={styles.nameItemListContent}>
            Current Token Price
          </span>
          <span className={styles.detailItemListContent}>
            {showTokenPrice?.current_price
              ? showTokenPrice?.current_price.toFixed(2)
              : "TBA"}
          </span>
        </li>
      </ul>
    );
  };

  const renderTokenDetailsRight = () => {
    return (
      <ul className={styles.listContent}>
        <li className={styles.itemListContent}>
          <span
            style={{ color: "#1e1e1e" }}
            className={styles.nameItemListContent}
          >
            Accepted Currency
          </span>
          {loadingPool ? (
            renderTextLoading()
          ) : (
            <span className={styles.detailItemListContent}>{currencyName}</span>
          )}
        </li>
        <li className={styles.itemListContent}>
          <span
            style={{ color: "#1e1e1e" }}
            className={styles.nameItemListContent}
          >
            Network
          </span>
          {loadingPool ? (
            renderTextLoading()
          ) : (
            <div className={styles.networkDisplay}>
              {poolDetails?.networkAvailable !== "tba" && (
                <Image
                width={24}
                height={24}
                  src={
                    NETWORK_SRC_ICON[
                      poolDetails?.networkAvailable ?? NETWORK.ETHEREUM
                    ]
                  }
                  alt="Network Icon"
                />
              )}
              <span className="total">
                {poolDetails?.networkAvailable === "tba"
                  ? "TBA"
                  : NETWORK_TEXT[
                      poolDetails?.networkAvailable ?? NETWORK.ETHEREUM
                    ]}
              </span>
            </div>
          )}
        </li>

        {poolDetails?.airdropNetwork &&
        poolDetails?.airdropNetwork !== "none" ? (
          <li className={styles.itemListContent}>
            <span
              style={{ color: "#1e1e1e" }}
              className={styles.nameItemListContent}
            >
              Token Airdrop Network
            </span>
            {loadingPool ? (
              renderTextLoading()
            ) : (
              <div className={styles.networkDisplay}>
                <Image width={24} height={24}
                  src={
                    NETWORK_SRC_ICON[
                      poolDetails?.airdropNetwork ?? NETWORK.ETHEREUM
                    ]
                  }
                  alt=""
                />
                <span className="total">
                  {
                    NETWORK_TEXT[
                      poolDetails?.airdropNetwork ?? NETWORK.ETHEREUM
                    ]
                  }
                </span>
              </div>
            )}
          </li>
        ) : (
          <li className={styles.itemListContent}>
            <span
              style={{ color: "#1e1e1e" }}
              className={styles.nameItemListContent}
            >
              Token Claim Network
            </span>
            {loadingPool ? (
              renderTextLoading()
            ) : (
              <div className={styles.networkDisplay}>
                {poolDetails?.networkAvailable !== "tba" &&
                  !poolDetails?.is_custom_network && (
                    <Image width={24} height={24}
                      src={
                        NETWORK_SRC_ICON[
                          poolDetails?.networkClaim ??
                            poolDetails?.networkAvailable ??
                            NETWORK.ETHEREUM
                        ]
                      }
                      alt=""
                    />
                  )}
                {CUSTOM_NETWORK &&
                  poolDetails?.networkAvailable !== "tba" &&
                  !!poolDetails?.is_custom_network && (
                    <Image width={24} height={24} src={poolDetails?.custom_network_icon ||'/assets/images/ton_symbol.svg'} alt="" />
                  )}
                <span className="total">
                  {poolDetails?.networkAvailable === "tba"
                    ? "TBA"
                    : !!poolDetails?.is_custom_network && CUSTOM_NETWORK
                    ? poolDetails?.custom_network_title
                    : NETWORK_TEXT[
                        poolDetails?.networkClaim ??
                          poolDetails?.networkAvailable ??
                          NETWORK.ETHEREUM
                      ]}
                </span>
              </div>
            )}
          </li>
        )}
        <li className={styles.itemListContent}>
          <span
            style={{ color: "#1e1e1e" }}
            className={styles.nameItemListContent}
          >
            Vesting Schedule
          </span>
          {loadingPool ? (
            renderTextLoading()
          ) : (
            <span
              className={
                styles.detailItemListContent + " text-schedule text-vesting"
              }
            >
              {poolDetails?.claimPolicy ?? "TBA"}
            </span>
          )}
        </li>

        {poolDetails?.token && (
          <li className={styles.itemListContent}>
            <span
              className={styles.nameItemListContent}
              style={{ color: "#1e1e1e" }}
            >
              Token Address
            </span>
            {loadingPool ? (
              renderTextLoading()
            ) : poolDetails?.hide_address ? (
              <span className={styles.detailItemListContent}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <span>********************</span>
                </div>
              </span>
            ) : (
              <span className={styles.detailItemListContent}>
                <Tooltip
                  classes={{ tooltip: styles.tooltip }}
                  title={
                    CUSTOM_NETWORK &&
                    !!poolDetails?.is_custom_network &&
                    !!poolDetails?.isCustomToken
                      ? poolDetails?.customToken
                      : poolDetails?.token
                  }
                  arrow
                  placement="top"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <span>
                      {CUSTOM_NETWORK &&
                      !!poolDetails?.is_custom_network &&
                      !!poolDetails?.isCustomToken
                        ? trimMiddlePartAddress(poolDetails?.customToken, 13)
                        : trimMiddlePartAddress(poolDetails?.token, 13)}
                    </span>
                    <CopyToClipboard
                      text={
                        CUSTOM_NETWORK &&
                        !!poolDetails?.is_custom_network &&
                        !!poolDetails?.isCustomToken
                          ? poolDetails?.customToken
                          : poolDetails?.token
                      }
                      onCopy={() => handleCopy()}
                    >
                      <div
                        style={{
                          marginLeft: "5px",
                        }}
                      >
                        {copied ? (
                          <svg
                            width="11px"
                            height="10px"
                            viewBox="0 0 11 10"
                            fill="none"
                          >
                            <path
                              d="M3.99996 7.54297L4.57407 7.54297L4.75065 7.5482C5.15437 7.56015 5.48444 7.26135 5.52062 6.85908C5.56482 6.36763 5.66204 5.84351 6.04188 5.46738L9.66114 1.73956C9.7001 1.69943 9.76441 1.69906 9.80383 1.73875L10.4301 2.36922C10.4688 2.40818 10.4688 2.47105 10.4302 2.51006L4.32029 8.67892C4.28148 8.71811 4.21826 8.71847 4.179 8.67972L0.571412 5.11963C0.53201 5.08074 0.531693 5.01725 0.570705 4.97798L1.19721 4.34727C1.23622 4.30798 1.29973 4.30788 1.33888 4.34704L2.52221 5.53075C2.83337 5.84742 2.91365 6.37085 2.96058 6.86863C2.99709 7.25593 3.3158 7.54297 3.70482 7.54297L3.99996 7.54297Z"
                              fill="#0066FF"
                            />
                          </svg>
                        ) : (
                          <svg
                            width="17px"
                            height="13px"
                            viewBox="0 0 17 20"
                            fill="none"
                          >
                            <path
                              d="M1.13332 0.611132H0.768707C0.870698 0.541492 0.99578 0.5 1.13332 0.5H11.3929C11.5304 0.5 11.6555 0.541492 11.7575 0.611132H11.3929H1.13332ZM0.5 1.11113C0.5 0.972027 0.549241 0.841067 0.633323 0.736332L0.633323 1.11113L0.633322 13.6718L0.633321 14.0466C0.549241 13.9418 0.5 13.8109 0.5 13.6718V1.11113ZM1.13332 14.2829C0.995779 14.2829 0.870697 14.2414 0.768706 14.1718H1.13332H2.84048V14.2829H1.13332ZM12.0262 1.11113V3.60598H11.8929V1.11113V0.736333C11.977 0.841068 12.0262 0.972027 12.0262 1.11113ZM4.9738 6.32824C4.9738 6 5.24798 5.71711 5.60713 5.71711H15.8667C16.2258 5.71711 16.5 6 16.5 6.32824V18.8889C16.5 19.2171 16.2258 19.5 15.8667 19.5H5.60712C5.24798 19.5 4.9738 19.2171 4.9738 18.8889V6.32824Z"
                              stroke="#0066FF"
                            />
                          </svg>
                        )}
                      </div>
                    </CopyToClipboard>
                  </div>
                </Tooltip>
              </span>
            )}
          </li>
        )}
      </ul>
    );
  };

  return (
    <section className={styles.sectionBuyTokenPoolDetails}>
      <div className={styles.midSection}>
        {poolDetails?.relationship_type !== "Giveaway"
          ? renderTokenDetailsLeft()
          : renderGiveawayTokenDetails()}
        {/* {renderTokenDetailsLeft()}
        {renderGiveawayTokenDetails()} */}

        {renderTokenDetailsRight()}
      </div>

      {RenderIntroduction()}
    </section>
  );
};

export default BuyTokenPoolDetails;
