import { isValidImageUrl } from "@/utils";
import Image, { ImageProps } from "next/image";
import React, { useEffect, useState, useCallback, useMemo } from "react";

interface CustomImageProps extends Omit<ImageProps, "src"> {
  src: string;
  defaultImage?: string;
  unoptimized?: boolean;
}

const CustomImage: React.FC<CustomImageProps> = ({
  src,
  defaultImage,
  alt,
  unoptimized = true,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string>(defaultImage as string);

  
  useEffect(() => {
    if (src && isValidImageUrl(src)) {
      setCurrentSrc(src);
    } else {
      setCurrentSrc(defaultImage as string);
    }
  }, [src, defaultImage]);

  const handleError = useCallback((e:any) => {
    // setCurrentSrc(defaultImage as string);
    ((e.target as HTMLImageElement).src = "/assets/images/defaultImages/image-placeholder.png")
  }, []);

  const [isBlurred, setIsBlurred] = useState<boolean>(false);

  const handleBlur = useCallback(() => {
    setIsBlurred(true);
  }, []);

  const memoizedSrc = useMemo(() => currentSrc || (defaultImage as string), [currentSrc, defaultImage]);

  return (
    <Image
      src={memoizedSrc}
      alt={alt || "Image"}
      onError={(e)=>handleError(e)}
      unoptimized={unoptimized}
      onBlur={handleBlur}
      style={{ filter: isBlurred ? "blur(5px)" : "none" }}
      {...props}
    />
  );
};

export default CustomImage;
