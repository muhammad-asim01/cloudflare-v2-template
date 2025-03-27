"use client";

import Skeleton from "@mui/lab/Skeleton";
import { useEffect, useRef, useState } from "react";
import ButtonLink from "@/components/Base/ButtonLink";
import axios from "@/services/axios";
import { NETWORK } from "@/constants";
import styles from "@/styles/welcome.module.scss"
import useResponsive from "@/hooks/useResponsive";
import Image from "next/image";
import CustomImage from "@/components/Base/Image";

const BackgroundComponent = (props: any) => {
  const {isMobile,isDesktop} = useResponsive()
  const inputSearchRef = useRef<HTMLDivElement | null>(null);
  const [isInputSearchFocus, setIsInputSearchFocus] = useState<boolean>(false);
  const [allPools, setAllPools] = useState<any>(null);
  const [loadingAllPools, setLoadingAllPools] = useState<boolean>(false);
  const [allPoolsDisplay, setAllPoolsDisplay] = useState<any[]>([]);
  const [inputSearch, setInputSearch] = useState<string>("");

  useOutsideAlerter(inputSearchRef);
  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      if (!ref) return;
      function handleClickOutside(event: any) {
        if (ref?.current && !ref?.current.contains(event.target)) {
          setIsInputSearchFocus(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  useEffect(() => {
    setLoadingAllPools(true);
    const timer = setTimeout(async () => {
      const response = (await axios.get(
        `/pools?page=1&limit=5&title=${inputSearch}`
      )) as any;
      setAllPools(response?.data?.data);
      setLoadingAllPools(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputSearch]);

  useEffect(() => {
    setAllPoolsDisplay(allPools?.data);
  }, [allPools]);

  const handleSearchChange = (e: any) => {
    setInputSearch(e.target.value);
  };

  const handleCloseSearch = () => {
    setInputSearch("");
  };
  const showSearchResult = !!inputSearch && isInputSearchFocus;

  const renderListResult = () => {
    return allPoolsDisplay.map((option: any, index: number) => {
      return (
        <li key={index} className="pool-option" {...props}>
          <a href={option?.network_available === NETWORK.SOLANA
        ? `/solana/buy-token/${option.id}`
        : `/buy-token/${option.id}`}>
           
              <CustomImage
                  width={24} height={24}
                       loading="lazy"
                       className="pool-img"
                       src={`${option?.banner}`}
                       alt=""
                       onError={(event: any) => {
                         event.target.src =   "/assets/images/defaultImages/image-placeholder.png";
                       }}
                       defaultImage={
                          "/assets/images/defaultImages/image-placeholder.png"
                       }
                     />
            <span className="pool-title">{option?.title}</span>
            <span className="pool-name">{option?.symbol}</span>
          </a>
        </li>
      );
    });
  };
  const renderNoResult = () => {
    return (
      <li className={styles.noResult}>
        <Image width={20} height={20} src="/assets/images/icons/no-result.svg" alt="" />
        <span className="no-option-title">No results</span>
        <span className="no-option-description">
          We couldn't find anything matching your search. Please try again
        </span>
      </li>
    );
  };
  const renderSkeletonSearching = () => {
    return new Array(5).fill(1).map((item, index) => {
      return (
        <li key={index}>
          <Skeleton
            className={styles.skeleton}
            variant="rectangular"
            width={"100%"}
            height={20}
          />
        </li>
      );
    });
  };

  return (
    <div className={styles.projectsBar} id="project_list">
      <span className="text-title">Project list</span>
      {isMobile && (
          <div className={"btn-container"}><ButtonLink
              className={styles.btnCalendar}
              text="Calendar view"
              to="/calendar"
              icon="/assets/images/icons/calendar.svg"
              spacing={6}
          />
          </div>
      )}
      <div className={styles.rightBar}>
        {!isMobile && (
          <ButtonLink
            className={styles.btnCalendar}
            text="Calendar view"
            to="/calendar"
            icon="/assets/images/icons/calendar.svg"
            spacing={6}
          />
        )}

        <div className={styles.customSearchField} ref={inputSearchRef}>
          <input
            className={
              styles.inputSearch +
              ` ${showSearchResult ? styles.inputSearching : ""}`
            }
            type="text"
            placeholder="Search by Pool name, Token Symbol"
            value={inputSearch}
            onChange={handleSearchChange}
            onFocus={() => setIsInputSearchFocus(true)}
          />
          {showSearchResult && (
            <Image width={20 } height={20}
              className={styles.iconClose}
              src="/assets/images/icons/icon_close.svg"
              alt=""
              onClick={handleCloseSearch}
            />
          )}
          <Image width={20 } height={20}
            className={styles.iconSearch}
            src="/assets/images/icons/icon_search.svg"
            alt=""
          />
          {showSearchResult && (
            <div className={styles.searchResult}>
              <ul>
                {loadingAllPools
                  ? renderSkeletonSearching()
                  : allPoolsDisplay && allPoolsDisplay.length > 0
                  ? renderListResult()
                  : renderNoResult()}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackgroundComponent;
