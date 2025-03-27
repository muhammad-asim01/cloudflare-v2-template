import { FormControlLabel, styled, Switch } from "@mui/material";
import dayjs from "dayjs";
import _ from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import LoadingTable from "@/components/Base/LoadingTable";

// import { BaseRequest } from "@/request/Request"; 
import commonStyles from "@/styles/commonstyle.module.scss";

import styles from "@/styles/calendarMobile.module.scss";
import { useRouter } from "next/router";
import { BaseRequest } from "@/request/Request";
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



const CalendarMobile = () => {
  const history = useRouter();
  const today = new Date();
  const region = moment.tz.guess();
  const timezone = moment.tz(region).format("z");

  const [listEvents, setListEvents] = useState<Array<any>>([]);
  const [loadingListEvents, setloadingListEvents] = useState<boolean>(false);
  const [daysOfMonth, setDaysOfMonth] = useState<Array<any>>([]);
  const [currentMonth, setCurrentMonth] = useState<any>(today);
  const [selectedDate, setSelectedDate] = useState(-1);

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
    let textType = type === "IDO" ? type : _.startCase(type.toLowerCase());
    let textPhase = !!index ? ` Phase ${index}` : "";
    return `${title} ${textType}` + textPhase;
  };

  const genDaysOfMonth = () => {
    const list: any[] = [];
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
          let titleWithType = getTitleWithType(
            event.title,
            event.event_type,
            event.index
          );

          let color = colorMap[event.event_type.toUpperCase()];

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

  const getEvent = async () => {
    try {
      let url = getUrlEvents();
      let baseRequest = new BaseRequest();
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
  };

  const changeMonth = (num: number) => {
    const newMonth = moment(currentMonth).add(num, "month").endOf("month");
    setCurrentMonth(newMonth);
  };

  const goToday = () => {
    setCurrentMonth(moment(today).endOf("month"));
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

  const selectDate = (dateIndex: number) => {
    setSelectedDate(dateIndex);
  };

  const renderHeaderContainer = () => {
    return (
      <div className={styles.header}>
        <div className={commonStyles.nnb2024i}>
          Calendar View &nbsp;
          <br />
          <span className={styles.textTimeZone}>
            (Time Zone: GMT{timezone})
          </span>
        </div>

        <a href={"/pools"} className={`${styles.btn} btn-list-view`}>
          <Image width={32} height={32} alt="" src={listIcon} />
          <span>List view</span>
        </a>

        <div className={styles.search}>
          <div className={styles.iconSearch}>
            <Image
              width={20}
              height={20}
              src="/assets/images/icons/icon_search.svg"
              alt=""
            />
          </div>

          <input
            type="text"
            placeholder="Search by Pool name, Token Symbol"
            value={filter.search}
            onChange={handleInputChange}
          />
          {filter.search && (
            <Image
              width={20}
              height={20}
              alt="close icon"
              className={styles.iconClose}
              src={closeIcon}
              onClick={clearSearch}
            />
          )}
        </div>
      </div>
    );
  };

  const renderSearchingContainer = () => {
    const renderSearchEmpty = () => {
      return (
        <div className={styles.noResult}>
          <Image width={20} height={20} alt="" src={noSearchIcon} />
          <h2 className={commonStyles.nnb1418i}>No results</h2>
          <p className={commonStyles.nnn1216h}>
            We couldn&apos;t find anything matching your search. Please try again!
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
                        {event.token_image && (
                          <Image
                            width={32}
                            height={32}
                            alt=""
                            src={event.token_image}
                            onError={(event: any) =>
                              (event.target.style.visibility = "hidden")
                            }
                          />
                        )}
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

  const renderSelectedDate = () => {
    const renderEventEmpty = () => {
      return (
        <div className={styles.noResult}>
          <Image width={24} height={24} alt="" src={noSearchIcon} />
          <h2 className={commonStyles.nnb1418i}>No events</h2>
          <p className={commonStyles.nnn1216h}></p>
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
    let showList = daysOfMonth;
    if (selectedDate >= 0) {
      const selectedDayEvent = daysOfMonth[selectedDate]?.events;
      if (selectedDayEvent && selectedDayEvent.length > 0) {
        showList = [daysOfMonth[selectedDate]];
      } else {
        showList = [];
      }
    }
    return (
      <>
        {showList && showList.length
          ? showList.map((day: any, i: number) => (
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
                        <Image
                          width={24}
                          height={24}
                          alt=""
                          src={event.token_image}
                        />
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
          : renderEventEmpty()}
      </>
    );
  };

  const renderCalendarView = () => {
    const renderPagination = () => {
      return (
        <div className={styles.paginationBar}>
          <div className="filter-bar">
            <div className={`${styles.btn} btn-today`} onClick={goToday}>
              Today
            </div>
            {renderFilterBar()}
          </div>
          <div className={"select-month"}>
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
                checked={filter.hideDailyVesting}
                onChange={handleToggleDailyVestingEvents}
              />
            }
            label="Hide daily vesting events"
            className={styles.toggle + " " + styles.toggleEvents}
          />
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
              className={`${styles.calendarPerDay} ${
                day.isToday ? styles.bgToday : ""
              } ${selectedDate === index ? "selected-day" : ""}`}
              onClick={() => {
                selectDate(index);
              }}
              style={{ opacity: day.disabled ? 0 : 1 }}
              key={index}
            >
              <div className={styles.dayTopLeft}>
                <span>{day.date.format("D")}</span>
              </div>
              {day.events.length > 0 && <div className={"active-dot"}></div>}
            </div>
          ))}
        </div>
      );
    };

    return (
      <>
        {renderPagination()}

        <div className={styles.calendarContainer}>
          {renderCalendarHeader()}

          {renderCalendarContent()}
        </div>
      </>
    );
  };

  return (
    <>
      <div className={styles.calendarView}>
        {renderHeaderContainer()}

        <div className={styles.wrapper}>
          {filter.search ? renderSearchingContainer() : renderCalendarView()}
        </div>

        {!filter.search && renderSelectedDate()}
      </div>
    </>
  );
};

export default CalendarMobile;
