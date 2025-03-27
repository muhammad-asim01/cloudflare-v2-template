'use client'

import styles from "@/styles/needHelp.module.scss";
import { useSelector } from "react-redux";
import Link from "next/link";

const ButtonMailto = (props: any) => {
  return (
    <Link
    prefetch
      href="#"
      onClick={(e) => {
        window.location = props.mailto;
        e.preventDefault();
      }}
    >
      {props.label}
    </Link>
  );
};

const NeedHelp = () => {
  const configData: any = useSelector((store: any) => store?.config?.data);
  return (
    <div className={styles.pageNeedHelp}>
      <h2 className={styles.title}>
        {configData?.needHelp?.title}
      </h2>
      <div className={styles.sectionBody}>
        <div>
          <div className={styles.subTitle}>
            {configData?.needHelp?.SupportEmail?.title}
          </div>
          <div className={styles.des}>
              <p
                dangerouslySetInnerHTML={{
                  __html: configData?.needHelp?.SupportEmail?.description,
                }}
              />
              <div>
                <p
                  dangerouslySetInnerHTML={{
                    __html: configData?.needHelp?.supportEmail?.description,
                  }}
                />
                <ButtonMailto
                  label={configData?.needHelp?.supportEmail?.email}
                  mailto={configData?.needHelp?.supportEmail?.link}
                />
              </div>
          </div>
        </div>
      </div>
      <div className={`${styles.sectionBody}`}>
        <div style={{ width: "100%" }}>
          {configData?.needHelp?.Guide && (
            <div className={styles.subTitle}>Guide</div>
          )}
          <ul className={styles.listQuestions}>
            {configData?.needHelp?.Guide?.map((item: any, i: any) => {
                  return (
                    <li key={i} className={styles.itemQuestions}>
                      <a
                        href={item?.guide_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span data-role="dot">&bull;</span>
                        <span data-role="title">{item?.guide_title}</span>
                      </a>
                    </li>
                  );
                })}
          </ul>
        </div>
      </div>{" "}
      {configData?.needHelp?.FAQ && (
        <div className={`${styles.sectionBody} ${styles.sectionBodyQuestions}`}>
          <div style={{ width: "100%" }}>
            <div className={styles.subTitle}>Documentation</div>
            <ul className={styles.listQuestions}>
              {configData?.needHelp?.FAQ?.map((item: any, i: any) => {
                return (
                  <li key={i} className={styles.itemQuestions}>
                    <a href={item.faq_url} target="_blank" rel="noreferrer">
                      <span data-role="dot">&bull;</span>
                      <span data-role="title">{item.faq_title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeedHelp;
