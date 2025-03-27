import React, { useState, useEffect, useCallback } from "react";
import styles from "@/styles/countdown.module.scss";

type CountDownProps = {
  startDate?: Date;
  getCurrentDateRealTime?: (currentDate: Date) => void;
  refetchPoolDetails?: any;
  refetchCurrentTier?: any;
  startTimePreOrder?: number;
  startFreeBuyTime?: number;
};

const Countdown: React.FC<CountDownProps> = ({
  startDate,
  getCurrentDateRealTime,
  refetchPoolDetails,
  refetchCurrentTier,
  startTimePreOrder,
  startFreeBuyTime,
}: CountDownProps) => {
  const [second, setSecond] = useState("0");
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("0");
  const [day, setDay] = useState("0");

  const emitCurrentDate = useCallback(
    (now: Date) => {
      getCurrentDateRealTime && getCurrentDateRealTime(now);
    },
    [getCurrentDateRealTime]
  );

  useEffect(() => {
    let countDownInterval = undefined as any;

    if (startDate && startDate >= new Date()) {
      const second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24;

      let countDown = startDate.getTime();
      countDownInterval = setInterval(function () {
        let now = new Date().getTime(),
          distance = countDown - now;
        let distancePreorder = startTimePreOrder
          ? (startTimePreOrder - now) / 1000
          : undefined;
        let distanceFreeBuy = startFreeBuyTime
          ? (startFreeBuyTime - now) / 1000
          : undefined;

        if (distance >= 0) {
          const currentDay = Math.floor(distance / day)
            .toString()
            .padStart(2, "0");
          const currentHour = Math.floor((distance % day) / hour)
            .toString()
            .padStart(2, "0");
          const currentMinute = Math.floor((distance % hour) / minute)
            .toString()
            .padStart(2, "0");
          const currentSecond = Math.floor((distance % minute) / second)
            .toString()
            .padStart(2, "0");

          setDay(currentDay);
          setHour(currentHour);
          setMinute(currentMinute);
          setSecond(currentSecond);
          emitCurrentDate(new Date(now));
        }

        // In PreOrder Time
        if (
          distancePreorder &&
          distancePreorder < 0.01 &&
          distancePreorder > -0.01
        ) {
          refetchPoolDetails && refetchPoolDetails();
        }

        // Start phase 2
        if (distanceFreeBuy && distanceFreeBuy > -0.7 && distanceFreeBuy <= -0.6) {
          refetchCurrentTier && refetchCurrentTier();
        }

        //do something later when date is reached
        if (distance <= 0 && countDownInterval) {
          clearInterval(countDownInterval);
          // window.location.reload();
          refetchPoolDetails && refetchPoolDetails();
        }
        //seconds
      }, 0);
    } else {
      setSecond("00");
      setMinute("00");
      setHour("00");
      setDay("00");
    }

    return () => {
      clearInterval(countDownInterval);
    };
  }, [startDate]);

  if (!startDate) {
    return <></>;
  }

  return (
    <div id="countdown">
      <ul className={styles.listCountDown}>
        <li className={styles.countdownPart + " number"}>
          <span>{day}</span>
          <span className={styles.countdownInfo}>Days</span>
        </li>
        <li className={styles.colon}>:</li>
        <li className={styles.countdownPart + " number"}>
          <span>{hour}</span>
          <span className={styles.countdownInfo}>Hours</span>
        </li>
        <li className={styles.colon}>:</li>
        <li className={styles.countdownPart + " number"}>
          <span>{minute}</span>
          <span className={styles.countdownInfo}>Minutes</span>
        </li>
        <li className={styles.colon}>:</li>
        <li className={styles.countdownPart + " number"}>
          <span>{second}</span>
          <span className={styles.countdownInfo}>Seconds</span>
        </li>
      </ul>
    </div>
  );
};

export default Countdown;
