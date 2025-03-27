import Dialog from "@mui/material/Dialog";
import moment from "moment";
import React from "react";
import styles from "@/styles/calendarModal.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Image from "next/image";

function AllPoolModal(props: any) {
  const { show, handleShow, showMore, currentId, dayList, gotoDetail } = props;
  const dayValue = dayList[currentId];

  const handleClose = () => {
    showMore(0);
    handleShow();
  };

  const renderDate = () => {
    const dayOfWeek = moment(dayValue?.date).format("ddd");
    const day = moment(dayValue?.date).format("MMM D YYYY");
    return `${dayOfWeek}, ${day}`;
  };

  return (
    <Dialog open={show} onClose={handleShow} className={styles.dialog}>
      <IconButton
        aria-label="close"
        className="button-close"
        onClick={handleClose}
      >
        <CloseIcon />
      </IconButton>
      <div className="title">{renderDate()}</div>
      {dayValue?.events.length &&
        dayValue?.events.map((ev: any, i: number) => (
          <div
            className={styles.event}
            key={i}
            style={{
              backgroundColor: ev.backgroundColor,
              borderLeft: `2px solid ${ev.color}`,
              cursor: "pointer",
            }}
            onClick={() => gotoDetail(ev.campaign_id)}
          >
            <div className={styles.logo}>
            {ev.token_image && <Image
            width={32} height={32}
            alt="" src={ev.token_image} />}
            </div>
            <div className={styles.info}>
              <p>
                {moment.unix(ev.start_time).format("HH:mm")}
                {ev.end_time &&
                  ` - ${moment.unix(ev.end_time).format("HH:mm")}`}
              </p>
              <p>{ev.title}</p>
            </div>
          </div>
        ))}
    </Dialog>
  );
}

export default AllPoolModal;
