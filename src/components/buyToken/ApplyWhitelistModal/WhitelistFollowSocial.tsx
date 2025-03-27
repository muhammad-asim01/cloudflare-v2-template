import { Tooltip } from "@mui/material";
import React from "react";
import styles from "@/styles/whitelistNotificationModal.module.scss"
import commonStyle from '@/styles/commonstyle.module.scss'
import useResponsive from "@/hooks/useResponsive";
import Image from "next/image";


const poolImage = "/assets/images/pool_circle.svg";
const iconLinkSocial = "/assets/images/iconLinkSocial.svg";

const StatusCompletedIcon = () => {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 0C3.14022 0 0 3.14015 0 7C0 10.8598 3.14022 14.0001 7 14.0001C10.8598 14.0001 14 10.8598 14 7C14 3.14015 10.8598 0 7 0ZM11.0195 5.81764L6.62178 10.2154C6.43479 10.4024 6.18622 10.5053 5.9218 10.5053C5.65738 10.5053 5.40882 10.4024 5.22182 10.2154L2.98048 7.97404C2.79348 7.78705 2.69049 7.53848 2.69049 7.27406C2.69049 7.00957 2.79348 6.761 2.98048 6.57401C3.1674 6.38702 3.41596 6.28403 3.68045 6.28403C3.94487 6.28403 4.19351 6.38702 4.38043 6.57408L5.92173 8.1153L9.61942 4.41761C9.80641 4.23062 10.055 4.1277 10.3194 4.1277C10.5838 4.1277 10.8324 4.23062 11.0194 4.41761C11.4055 4.80372 11.4055 5.43168 11.0195 5.81764Z"
        fill="#71FFAA"
      />
    </svg>
  );
};

const StatusPendingIcon = () => {
  return (
    <Tooltip
      enterTouchDelay={50}
      title={<p style={{ fontSize: 12 }}>Pending: Checking is temporarily unavailable</p>}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7 0C3.14005 0 0 3.14005 0 7C0 10.86 3.14005 14 7 14C10.86 14 14 10.86 14 7C14 3.14005 10.86 0 7 0ZM10.3291 10.6207C10.2153 10.7345 10.066 10.7917 9.9167 10.7917C9.76738 10.7917 9.61795 10.7345 9.5043 10.6207L6.5876 7.7041C6.47791 7.59505 6.4167 7.44679 6.4167 7.2917V3.5C6.4167 3.17743 6.67796 2.9167 7 2.9167C7.32204 2.9167 7.5833 3.17743 7.5833 3.5V7.0502L10.3291 9.7959C10.5571 10.024 10.5571 10.3927 10.3291 10.6207Z"
          fill="#FFD058"
        />
      </svg>
    </Tooltip>
  );
};

const StatusRejectedIcon = () => {
  return (
    <Tooltip
      enterTouchDelay={50}
      title={<p style={{ fontSize: 12 }}>Error: You haven&apos;t followed yet</p>}
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M7.02734 0C3.18254 0 0 3.12785 0 6.97266C0 10.8175 3.18254 14 7.02734 14C10.8721 14 14 10.8175 14 6.97266C14 3.12785 10.8721 0 7.02734 0ZM10.4787 9.26379C10.7986 9.58371 10.7986 10.1041 10.4787 10.4243C10.1612 10.7414 9.64086 10.7466 9.3182 10.4243L7.02734 8.13258L4.68152 10.4245C4.3616 10.7445 3.84125 10.7445 3.52105 10.4245C3.20113 10.1046 3.20113 9.58426 3.52105 9.26406L5.81246 6.97266L3.52105 4.68125C3.20113 4.36105 3.20113 3.8407 3.52105 3.52078C3.84125 3.20086 4.3616 3.20086 4.68152 3.52078L7.02734 5.81273L9.3182 3.52078C9.63758 3.20141 10.1579 3.20031 10.4787 3.52078C10.7986 3.8407 10.7986 4.36105 10.4787 4.68125L8.18727 6.97266L10.4787 9.26379Z"
          fill="#D01F36"
        />
      </svg>
    </Tooltip>
  );
};
enum SocialType {
  TWITTER = "twitter.com",
  TELEGRAM = "t.me",
}

const StatusIcon = (props: { status: number | undefined }) => {
  const { status } = props;
  return status !== undefined ? (
    <>
      {(status === 1 && <StatusCompletedIcon />) || (status === 3 && <StatusRejectedIcon />) || (
        <StatusPendingIcon />
      )}
    </>
  ) : (
    <></>
  );
};

function WhitelistFollowSocial(props: any) {
  const { isDesktop:isDesktopResp} = useResponsive()

  const { poolDetails, whitelistSubmission } = props;


  if (!poolDetails?.socialRequirement) {
    return <></>;
  }

  const SocialField = (props: {
    username: string | undefined;
    status: number | undefined;
    type: SocialType | undefined;
    isMobile?: boolean;
  }) => {
    const { username, status, type, isMobile = false } = props;
    const renderFlexCell = () => {
      return (
        <div className="flex-cell">
          {username && (
            <>
              <a
                className={styles.socialAnchorlink}
                target="_blank"
                rel="noopener noreferrer"
                href={`https://${type}/${username.replace(/^@/, "")}`}
              >
                <span>@{username.replace(/^@/, "")}</span>
                <Image width={24} height={24} src={iconLinkSocial} alt="" />
              </a>
              <StatusIcon status={status} />
            </>
          )}
        </div>
      );
    };
    if (isMobile) return <>{renderFlexCell()}</>;
    return <td>{renderFlexCell()}</td>;
  };

  return (
    <div className={styles.WhitelistFollowSocial}>
      <div className={styles.socialCompanyTitle}>
        Follow and subcribe to&nbsp;
        {`${poolDetails?.title}`} and DegenPad’s accounts
      </div>
      <div className={styles.socialFollowContent}>
        {isDesktopResp && (
          <table className={styles.socialFollowTable}>
            <thead>
              <tr>
                <th></th>
                <th>
                  <Image width={50} height={50} className={styles.iconToken} src={poolDetails?.banner || poolImage} alt="" />
                  <span className={styles.titleToken}>{poolDetails?.title}</span>
                </th>
                <th>
                  <Image width={30} height={30} className={styles.iconToken} src="/assets/images/logo-chaingpt.svg" alt="" />
                  <span className={styles.titleToken}>DegenPad</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={styles.socialTitleCol}>Official Twitter</td>

                <SocialField
                  username={poolDetails?.socialRequirement?.partner_twitter}
                  status={whitelistSubmission?.partner_twitter_status}
                  type={SocialType.TWITTER}
                />
                <SocialField
                  username={poolDetails?.socialRequirement?.self_twitter}
                  status={whitelistSubmission?.self_twitter_status}
                  type={SocialType.TWITTER}
                />
              </tr>
              <tr>
                <td className={styles.socialTitleCol}>Community Group</td>
                <SocialField
                  username={poolDetails?.socialRequirement?.partner_group}
                  status={whitelistSubmission?.partner_group_status}
                  type={SocialType.TELEGRAM}
                />
                <SocialField
                  username={poolDetails?.socialRequirement?.self_group}
                  status={whitelistSubmission?.self_group_status}
                  type={SocialType.TELEGRAM}
                />
              </tr>
              <tr>
                <td className={styles.socialTitleCol}>Announcement Channel</td>
                <SocialField
                  username={poolDetails?.socialRequirement?.partner_channel}
                  status={whitelistSubmission?.partner_channel_status}
                  type={SocialType.TELEGRAM}
                />
                <SocialField
                  username={poolDetails?.socialRequirement?.self_channel}
                  status={whitelistSubmission?.self_channel_status}
                  type={SocialType.TELEGRAM}
                />
              </tr>
            </tbody>
          </table>
        )}

        {!isDesktopResp && (
          <div style={{ width: "100%" }}>
            <table className={styles.socialFollowTable}>
              <thead>
                <tr>
                  <th colSpan={2}>
                    <Image width={30}
                    height={30}
                      className={styles.iconToken}
                      src={poolDetails?.banner || poolImage}
                      alt=""
                    />
                    <span>{poolDetails?.title}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.socialTitleCol}>Official Twitter</td>
                  <SocialField
                    username={poolDetails?.socialRequirement?.partner_twitter}
                    status={whitelistSubmission?.partner_twitter_status}
                    type={SocialType.TWITTER}
                  />
                </tr>
                <tr>
                  <td className={styles.socialTitleCol}>Community Group</td>
                  <SocialField
                    username={poolDetails?.socialRequirement?.partner_group}
                    status={whitelistSubmission?.partner_group_status}
                    type={SocialType.TELEGRAM}
                  />
                </tr>
                <tr>
                  <td className={styles.socialTitleCol}>Announcement Channel</td>
                  <SocialField
                    username={poolDetails?.socialRequirement?.partner_channel}
                    status={whitelistSubmission?.partner_channel_status}
                    type={SocialType.TELEGRAM}
                  />
                </tr>
              </tbody>
            </table>

            <table className={styles.socialFollowTable}>
              <thead>
                <tr>
                  <th colSpan={2}>
                    <Image width={30} height={30} className={styles.iconToken} src="/assets/images/logo-chaingpt.svg" alt="" />
                    <span>DegenPad</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={styles.socialTitleCol}>Official Twitter</td>
                  <SocialField
                    username={poolDetails?.socialRequirement?.self_twitter}
                    status={whitelistSubmission?.self_twitter_status}
                    type={SocialType.TWITTER}
                  />
                </tr>
                <tr>
                  <td className={styles.socialTitleCol}>Community Group</td>
                  <SocialField
                    username={poolDetails?.socialRequirement?.self_group}
                    status={whitelistSubmission?.self_group_status}
                    type={SocialType.TELEGRAM}
                  />
                </tr>
                <tr>
                  <td className={styles.socialTitleCol}>Announcement Channel</td>
                  <SocialField
                    username={poolDetails?.socialRequirement?.self_channel}
                    status={whitelistSubmission?.self_channel_status}
                    type={SocialType.TELEGRAM}
                  />
                </tr>
              </tbody>
            </table>
          </div>
        )}
        {isDesktopResp && (
          <div className={commonStyle.flexCol}>
            <div className={styles.socialMobile}>
              <div className={commonStyle.flexRow}>
                <Image width={30} height={30} className={styles.iconToken} src={poolDetails?.banner || poolImage} alt="" />
                <span className={styles.titleToken}>{poolDetails?.title}</span>
              </div>
              <span className={styles.socialTitleCol}>Official Twitter</span>
              <SocialField
                username={poolDetails?.socialRequirement?.partner_twitter}
                status={whitelistSubmission?.partner_twitter_status}
                type={SocialType.TWITTER}
                isMobile={true}
              />
              <span className={styles.socialTitleCol}>Community Group</span>
              <SocialField
                username={poolDetails?.socialRequirement?.partner_group}
                status={whitelistSubmission?.partner_group_status}
                type={SocialType.TELEGRAM}
                isMobile={true}
              />
              <span className={styles.socialTitleCol}>Announcement Channel</span>
              <SocialField
                username={poolDetails?.socialRequirement?.partner_channel}
                status={whitelistSubmission?.partner_channel_status}
                type={SocialType.TELEGRAM}
                isMobile={true}
              />
            </div>
            <div className={styles.socialMobile}>
              <div className={commonStyle.flexRow}>
                <Image width={40} height={40} className={styles.iconToken} src="/assets/images/logo-chaingpt.svg" alt="" />
                <span className={styles.titleToken}>DegenPad</span>
              </div>
              <span className={styles.socialTitleCol}>Official Twitter</span>
              <SocialField
                username={poolDetails?.socialRequirement?.self_twitter}
                status={whitelistSubmission?.self_twitter_status}
                type={SocialType.TWITTER}
                isMobile={true}
              />
              <span className={styles.socialTitleCol}>Community Group</span>
              <SocialField
                username={poolDetails?.socialRequirement?.self_group}
                status={whitelistSubmission?.self_group_status}
                type={SocialType.TELEGRAM}
                isMobile={true}
              />
              <span className={styles.socialTitleCol}>Announcement Channel</span>
              <SocialField
                username={poolDetails?.socialRequirement?.self_channel}
                status={whitelistSubmission?.self_channel_status}
                type={SocialType.TELEGRAM}
                isMobile={true}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WhitelistFollowSocial;
