"use client";

import { useSelector } from "react-redux";
import styles from "@/styles/footerDefaultLayout.module.scss";

import CustomImage from "../Image";

interface MenuItem {
  id: number;
  menu_name: string;
  menu_url: string;
  type: string;
  icon_url: string;
  is_parent: number; // or boolean if it represents a boolean value
  parent_id: string;
  created_at: string;
  updated_at: string;
  children: MenuItem[]; // Recursive type reference for nested menus
}

type SocialMediaLink = {
  id: number;
  social_media_type_id: number;
  sm_link: string;
  sort_id: number;
  created_at: string;
  updated_at: string;
  sm_type?: string;
};
const FooterDefaultLayout = () => {

  const configData: any = useSelector((store: any) => store?.config?.data);
  const menu: MenuItem[] = configData?.Menus;
  const footer_description = configData?.footer_description;
  const footer_copyright = configData?.footer_copyright;
  const socialMediaLinks = configData?.SocialMediaLinks.reduce(
    (acc: any, smType: any) => [
      ...acc,
      ...smType.socialMediaLinks.map((link: any) => ({
        ...link,
        sm_type: smType.sm_type,
      })),
    ],
    [] as SocialMediaLink[]
  ).sort((a: any, b: any) => a.sort_id - b.sort_id);
  const footerMenus = menu?.filter((menu) => menu.type === "footer");

  const getSocialMediaImage = (smType: string) => {
    switch (smType) {
      case "Telegram":
        return "/assets/images/socials/telegram.svg";
      case "Twitter":
        return "/assets/images/socials/twitter.svg";
      case "Medium":
        return "/assets/images/socials/m.svg";
      case "LinkedIn":
        return "/assets/images/socials/linkedin.svg";
      case "CoinMarketCap":
        return "/assets/images/socials/cmc.svg";
      case "Discord":
        return "/assets/images/socials/discord.svg";
      case "YouTube":
        return "/assets/images/socials/youtube.svg";
      case "Instagram":
        return "/assets/images/socials/instagram.svg";
      // Add cases for other social media types
      default:
        return "path/to/default-image.png";
    }
  };

  return (
    <div className={styles.footer + " footer"}>
      <div className={styles.mainContent}>
        <div className={styles.infoRedKite}>
          <p
            dangerouslySetInnerHTML={{
              __html: footer_description,
            }}
          />
          <ul className={styles.shareLink}>
            {socialMediaLinks?.map((socialMedia: any, index: any) => {
              return (
                <li key={index}>
                  <a
                    href={socialMedia?.sm_link}
                    target="_blank"
                    rel="noreferrer nofollow"
                  >
                    {getSocialMediaImage(socialMedia?.sm_type) && (
                      <CustomImage
                        width={20}
                        height={20}
                        src={getSocialMediaImage(socialMedia?.sm_type)}
                        alt=""
                        onError={(event: any) => {
                          event.target.src =
                            "/assets/images/defaultImages/image-placeholder.png";
                        }}
                        defaultImage={
                          "/assets/images/defaultImages/image-placeholder.png"
                        }
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className={styles.endContent}>
        <p className={styles.copyRight}>{footer_copyright}</p>
        <div className={styles.subContent}>
          {footerMenus?.map((service: any, index: any) => (
            <a
              key={index}
              href={service.menu_url}
              target="_blank"
              rel="noreferrer"
            >
              {service?.menu_name}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterDefaultLayout;
