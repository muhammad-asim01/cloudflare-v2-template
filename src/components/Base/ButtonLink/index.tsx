import React from 'react'
import Link from 'next/link';
import classes from "@/styles/buttonLink.module.scss";
import Image from 'next/image';

type IButton = {
  text: string;
  icon?: any;
  to: string;
  spacing?: number;
  className?: string;
  onClick?: any,
}

const ButtonLink: React.FC<IButton> = (props: IButton) => {
  const { text, icon, to, className = '', onClick } = props;

  const cssClass = className || classes.button;

  function ensureLeadingSlash(path) {
    return path.startsWith('/') ? path : '/' + path;
  }

  return (
    <Link
    prefetch
      className={cssClass}
      {...( onClick && { onClick })}
      href={ensureLeadingSlash(to)}
    >
      <p className={classes.buttonContent}>
          {
            icon && <Image src={`${icon}`} width={16}
            height={16} alt=""/>
          }
          <span className={classes.buttonText}>{text}</span>
      </p>
    </Link>
  )
}

export default ButtonLink;
