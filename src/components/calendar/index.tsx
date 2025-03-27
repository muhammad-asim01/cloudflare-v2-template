"use client";

import { FormControlLabel, Select, styled, Switch } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from "dayjs";
import _ from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import LoadingTable from "@/components/Base/LoadingTable";
import { POOL_IS_PRIVATE } from "@/constants";
import { BaseRequest } from "@/request/Request";
import commonStyles from "@/styles/commonstyle.module.scss";

import styles from "@/styles/calendar.module.scss";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/navigation";
import CalendarMobile from "@/components/calendar/CalendarMobile";
import AllPoolModal from "@/components/calendar/AllPoolModal";
import Image from "next/image";

const listIcon = "/assets/images/icons/calendar.svg";
const closeIcon = "/assets/images/icons/icon_close.svg";
const noSearchIcon = "/assets/images/noResults.svg";

// Color type RGB
const colorMap: any = {
  WHITELIST_OPENING: "94, 255, 139",
  COMPETITION_OPENING: "94, 255, 139",
  WHITELIST_CLOSING: "208, 31, 54",
  COMPETITION_CLOSING: "208, 31, 54",
  IDO: "103, 136, 255",
  CLAIM: "255, 208, 88",
};
const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const ALL_POOLS = "1000";
const poolTypes = [
  { value: ALL_POOLS, babel: "All Pools" },
  { value: POOL_IS_PRIVATE.PUBLIC, babel: "Public Pools" },
  { value: POOL_IS_PRIVATE.PRIVATE, babel: "Private Pools" },
  { value: POOL_IS_PRIVATE.SEED, babel: "Seed Pools" },
  { value: POOL_IS_PRIVATE.COMMUNITY, babel: "Community Pools" },
];

const IOSSwitch = styled(Switch)(({ theme }) => ({
  width: 37,
  height: 22,
  padding: 0,
  marginRight: 5,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#0066FF",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: "rgba(217, 217, 217, 0.1)", // Fixed invalid color format
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 18,
    height: 18,
  },
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    backgroundColor: "#ccc", // Fixed invalid background color
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));


const Calendar = () => {

  const history = useRouter();
  const today = new Date();
  const region = moment.tz.guess();
  const timezone = moment.tz(region).format("z");

  const [listEvents, setListEvents] = useState<Array<any>>([]);
  const [loadingListEvents, setloadingListEvents] = useState<boolean>(false);
  const [daysOfMonth, setDaysOfMonth] = useState<Array<any>>([]);
  const [currentMonth, setCurrentMonth] = useState<Date | moment.Moment>(today);

  const [showAllPoolsModal, setShowAllPoolsModal] = useState(false);
  const [currentId, setCurrentId] = useState(0);

  const [filter, setFilter] = useState<{
    poolTypes: string | number;
    search: string;
    hideEnded: boolean;
    hideDailyVesting: boolean;
    myEvents: boolean;
    babel: string;
  }>({
    poolTypes: ALL_POOLS,
    search: "",
    hideEnded: false,
    hideDailyVesting: false,
    myEvents: false,
    babel: "",
  });

  useEffect(() => {
    setloadingListEvents(true);
    const timer = setTimeout(() => {
      getEvent();
    }, 500);
    return () => clearTimeout(timer);
  }, [currentMonth, filter]);

  useEffect(() => {
    genDaysOfMonth();
  }, [listEvents]);

  const getTitleWithType = (
    title: string,
    type: string,
    index: number | null
  ) => {
    const textType = type === "IDO" ? type : _.startCase(type.toLowerCase());
    const textPhase = !!index ? ` Phase ${index}` : "";
    return `${title} ${textType}` + textPhase;
  };

  const genDaysOfMonth = () => {
    const list: any = [];
    let firstSunday = moment(currentMonth).startOf("month").startOf("week");
    const lastSaturday = moment(currentMonth).endOf("month").endOf("week");
    while (
      moment(firstSunday).isBefore(lastSaturday) ||
      moment(firstSunday).isSame(lastSaturday)
    ) {
      const dayEvents = listEvents
        .filter((event: any) => {
          const date = moment.unix(event.start_time).format("YYYY-MM-DD");
          return moment(firstSunday).isSame(date, "day");
        })
        .map((event: any) => {
          const titleWithType = getTitleWithType(
            event.title,
            event.event_type,
            event.index
          );

          const color = colorMap[event.event_type.toUpperCase()];

          return {
            ...event,
            title: titleWithType,
            color: `rgb(${color})`,
            backgroundColor: `rgba(${color}, 15%)`,
          };
        });
      const isToday = moment(firstSunday).isSame(today, "day");
      list.push({
        disabled:
          moment(firstSunday).isBefore(currentMonth, "month") ||
          moment(firstSunday).isAfter(currentMonth, "month"),
        date: firstSunday,
        events: dayEvents,
        isToday: isToday,
      });
      firstSunday = moment(firstSunday).add(1, "day");
    }
    setDaysOfMonth(list);
  };

  const getUrlEvents = () => {
    const firstSunday = moment(currentMonth).startOf("month").startOf("week");
    const lastSaturday = moment(currentMonth).endOf("month").endOf("week");
    const firstDay = moment(firstSunday).format("YYYY-MM-DD HH:mm:ss");
    const lastDay = moment(lastSaturday).format("YYYY-MM-DD HH:mm:ss");
    const startTime = moment(firstDay).unix();
    const endTime = moment(lastDay).unix();
    const { search, hideEnded, poolTypes, myEvents, hideDailyVesting } = filter;

    let url = `/event-list?start_time=${startTime}&end_time=${endTime}&hide_completed=${hideEnded}&my_event=${myEvents}&hide_daily_vesting=${hideDailyVesting}`;
    if (poolTypes !== ALL_POOLS) url += `&is_private=${poolTypes}`;
    if (search) url += `&search=${search}`;

    return url;
  };

  const getEvent =async () => {
    
      try {
        const url = getUrlEvents();
        const baseRequest = new BaseRequest();
        const response = (await baseRequest.get(url)) as any;
        const resObj = await response.json();
        if (resObj?.status && resObj.status === 200) {
          const data = resObj.data ?? [];
          setListEvents(data);
          setloadingListEvents(false);
        }
      } catch (err) {
        console.log("Error getEvent", err);
        setloadingListEvents(false);
      }
    }
  

  const changeMonth = (num: number) => {
    const newMonth = moment(currentMonth).add(num, "month").endOf("month");
    setCurrentMonth(newMonth);
  };

  const goToday = () => {
    setCurrentMonth(moment(today).endOf("month"));
  };

  const handleChangePoolType = (e: any) => {
    setFilter({
      ...filter,
      poolTypes: e.target.value,
    });
  };

  const handleInputChange = (e: any) => {
    setFilter({
      ...filter,
      search: e.target.value,
    });
  };

  const clearSearch = () => {
    setFilter({
      ...filter,
      search: "",
    });
  };

  const handleToggleMyEvents = (e: any) => {
    setFilter({
      ...filter,
      myEvents: e.target.checked,
    });
  };

  const handleToggleEndedEvents = (e: any) => {
    setFilter({
      ...filter,
      hideEnded: e.target.checked,
    });
  };

  const handleToggleDailyVestingEvents = (e: any) => {
    setFilter({
      ...filter,
      hideDailyVesting: e.target.checked,
    });
  };

  const validSearch = () => {
    if (daysOfMonth && daysOfMonth.length) {
      return daysOfMonth.some((day) => day.events.length);
    }
    return false;
  };

  const gotoDetail = (id: number) => {
    history.push(`/buy-token/${id}`);
  };

  const isShowMore = (itemLength: number) => {
    return itemLength > 2;
  };

  const handleShowModalAllPools = () => {
    setShowAllPoolsModal(!showAllPoolsModal);
  };

  const showMore = (id: number) => {
    setCurrentId(id);
    handleShowModalAllPools();
  };

  const renderHeaderContainer = () => {
    return (
      <div className={styles.header}>
        <div className={commonStyles.nnb2024i}>
          Calendar View &nbsp;
          <span className={styles.textTimeZone}>
            (Time Zone: GMT{timezone})
          </span>
        </div>

        <a href={"/pools"} className={`${styles.btn} btn-list-view`}>
          <Image width={24} height={24} alt="" src={listIcon} />
          <span>List view</span>
        </a>

        <div className={styles.search}>
          <input
            type="text"
            placeholder="Search by Pool name, Token Symbol"
            value={filter.search}
            onChange={handleInputChange}
          />
          {filter.search && (
            <Image width={20} height={20}
        alt="close icon"
              className={styles.iconClose}
              
              src={closeIcon}
              onClick={clearSearch}
            />
          )}
          <div className={styles.iconSearch}>
            <Image width={24} height={24} src="/assets/images/icons/icon_search.svg" alt="" />
          </div>
        </div>
      </div>
    );
  };

  const renderSearchingContainer = () => {
    const renderSearchEmpty = () => {
      return (
        <div className={styles.noResult}>
          <Image width={23} height={23} alt="" src={noSearchIcon} />
          <h2 className={commonStyles.nnb1418i}>No results</h2>
          <p className={commonStyles.nnn1216h}>
            We couldn&apos;t find anything matching your search. Please try
            again!
          </p>
        </div>
      );
    };

    const renderDateSearch = (date: any) => {
      const dates = moment(date).format("ddd");
      const times = moment(date).format("MMM DD YYYY");
      return `${dates}, ${times}`;
    };

    const renderLoadingEvents = () => {
      return (
        <div className={styles.tableLoading}>
          <LoadingTable />
        </div>
      );
    };

    if (loadingListEvents) return renderLoadingEvents();

    return (
      <>
        {daysOfMonth && daysOfMonth.length && validSearch()
          ? daysOfMonth.map((day: any, i: number) => (
              <div
                style={{ display: day?.events?.length ? "block" : "none" }}
                className={styles.result}
                key={i}
              >
                <div className={styles.resultHeader}>{day.title}</div>
                <div className={styles.timeSearch}>
                  {renderDateSearch(day.date)}
                </div>
                <div className={styles.resultContent}>
                  {day.events.map((event: any, i: number) => (
                    <div
                      className={styles.event}
                      key={i}
                      style={{
                        backgroundColor: event.backgroundColor,
                        borderLeft: `3px solid ${event.color}`,
                      }}
                      onClick={() => gotoDetail(event.campaign_id)}
                    >
                      <div className={styles.logo}>
                        { event.token_image && <Image 
                        width={32} height={32}
                          alt=""
                          src={event.token_image}
                          onError={(event: any) =>
                            (event.target.style.visibility = "hidden")
                          }
                        />}
                      </div>
                      <div className={styles.eventInfo}>
                        <span className={commonStyles.nnn1012h}>
                          {dayjs(event.start_time).format("HH:mm")}
                          {event.end_time &&
                            ` - ${moment.unix(event.end_time).format("HH:mm")}`}
                        </span>
                        <span className={styles.poolName}>{event.title}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          : renderSearchEmpty()}
      </>
    );
  };

  const renderCalendarView = () => {
    const renderPagination = () => {
      return (
        <div className={styles.paginationBar}>
          <div className={styles.paginationBtn}>
            <input
              type="button"
              className={styles.btnPrevious}
              onClick={() => changeMonth(-1)}
            />
          </div>

          <div className={styles.month}>
            {moment(currentMonth).format("MMMM YYYY")}
          </div>

          <div className={styles.paginationBtn}>
            <input
              type="button"
              className={styles.btnNext}
              onClick={() => changeMonth(1)}
            />
          </div>

          <div className={`${styles.btn} btn-today`} onClick={goToday}>
            Today
          </div>
        </div>
      );
    };

    const renderFilterBar = () => {
      return (
        <div className={styles.filterBar}>
          <FormControlLabel
            control={
              <IOSSwitch
                sx={{ m: 1 }}
                checked={filter.myEvents || false}
                onChange={handleToggleMyEvents}
              />
            }
            label="My Events"
            className={styles.toggle + " " + styles.toggleEvents}
          />

          <FormControlLabel
            control={
              <IOSSwitch
                sx={{ m: 1 }}
                checked={filter.hideEnded}
                onChange={handleToggleEndedEvents}
              />
            }
            label="Hide completed events"
            className={styles.toggle + " " + styles.toggleEvents}
          />

          <FormControlLabel
            control={
              <IOSSwitch
                sx={{ m: 1 }}
                checked={filter.hideDailyVesting}
                onChange={handleToggleDailyVestingEvents}
              />
            }
            label="Hide daily vesting events"
            className={styles.toggle + " " + styles.toggleEvents}
          />

          <Select
            className={styles.selectBox}
            native
            IconComponent={ExpandMoreIcon}
            value={filter.poolTypes}
            onChange={handleChangePoolType}
            inputProps={{
              name: "type",
              id: "list-types",
            }}
          >
            {poolTypes?.map((item: any, index: number) => {
              return (
                <option value={item.value} key={index}>
                  {item.babel}
                </option>
              );
            })}
          </Select>
        </div>
      );
    };

    const renderCalendarHeader = () => {
      return (
        <div className={styles.calendarHeader}>
          {weekDays.map((h) => (
            <div className={styles.calendarHeaderItem} key={h}>
              {h}
            </div>
          ))}
        </div>
      );
    };

    const renderCalendarContent = () => {
      return (
        <div className={styles.calendarContent}>
          {daysOfMonth.map((day: any, index: number) => (
            <div
              className={
                styles.calendarPerDay + ` ${day.isToday ? styles.bgToday : ""}`
              }
              style={{ opacity: day.disabled ? 0.42 : 1 }}
              key={index}
            >
              <div className={styles.dayTopLeft}>
                <span>{day.date.format("D")}</span>  
              </div>
              {day.events.map((event: any, i: number) => {
                // render only first 2 events per day
                if (isShowMore(day.events.length) && i >= 2) return null;
                return (
                  <div
                    className={styles.event}
                    key={i}
                    style={{
                      backgroundColor: event.backgroundColor,
                      borderLeft: `3px solid ${event.color}`,
                    }}
                    onClick={() => gotoDetail(event.campaign_id)}
                  >
                    <div className={styles.logo}>
                     {event.token_image &&  <Image 
                     width={32} height={32}
                        alt=""
                        src={event.token_image}
                        onError={(event: any) =>
                          (event.target.style.visibility = "hidden")
                        }
                      />}
                    </div>
                    <div className={styles.eventInfo}>
                      <span className={commonStyles.nnn1012h}>
                        {moment.unix(event.start_time).format("HH:mm")}
                        {event.end_time &&
                          ` - ${moment.unix(event.end_time).format("HH:mm")}`}
                      </span>
                      <span className={styles.poolName}>{event.title}</span>
                    </div>
                  </div>
                );
              })}
              {isShowMore(day.events.length) && (
                <div
                  onClick={() => showMore(index)}
                  className={styles.showMore}
                >
                  View All
                </div>
              )}
            </div>
          ))}
        </div>
      );
    };

    return (
      <>
        {renderPagination()}

        <div className={styles.calendarContainer}>
          {renderFilterBar()}

          {renderCalendarHeader()}

          {renderCalendarContent()}
        </div>
      </>
    );
  };

  const renderAboutEventColors = () => {
    return (
      <div className={styles.eventColors}>
        <div className={styles.colorDetail}>
          <div className={`${styles.dotColor} bg-open`}></div>
          <span className={commonStyles.nnn1424h}>
            Whitelist / Competition Open
          </span>
        </div>
        <div className={styles.colorDetail}>
          <div className={`${styles.dotColor} bg-close`}></div>
          <span className={commonStyles.nnn1424h}>
            Whitelist / Competition Close
          </span>
        </div>
        <div className={styles.colorDetail}>
          <div className={`${styles.dotColor} bg-ido`}></div>
          <span className={commonStyles.nnn1424h}>IDO</span>
        </div>
        <div className={styles.colorDetail}>
          <div className={`${styles.dotColor} bg-claim`}></div>
          <span className={commonStyles.nnn1424h}>Claim</span>
        </div>
      </div>
    );
  };

  if (isMobile) {
    return <CalendarMobile />;
  }

  return (
    <>
      <div className={styles.calendarView}>
        {renderHeaderContainer()}

        <div className={styles.wrapper}>
          {filter.search ? renderSearchingContainer() : renderCalendarView()}
        </div>

        {daysOfMonth &&
          daysOfMonth.length &&
          validSearch() &&
          renderAboutEventColors()}
      </div>

      <AllPoolModal
        show={showAllPoolsModal}
        handleShow={handleShowModalAllPools}
        showMore={showMore}
        currentId={currentId}
        dayList={daysOfMonth}
        gotoDetail={gotoDetail}
      />
    </>
  );
};

export default Calendar;
