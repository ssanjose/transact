'use client';

import Image, { ImageProps, StaticImageData } from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';

type NextImageSrc = string | StaticImageData;

interface ImageFrameProps extends Omit<ImageProps, 'src'> {
  src: NextImageSrc;
  alt: string;
  containerClassName?: string;
  width?: number;
  height?: number;
  fill?: boolean;
}

const ImageFrame = ({ className, src, alt, containerClassName, ...rest }: ImageFrameProps) => {
  return (
    <div className={cn("rounded-lg bg-card-overview p-4 mt-[5rem] mx-4 border-2", containerClassName)}>
      <Image
        className={cn(``, className)}
        src={src}
        alt={alt}
        {...rest}
      />
    </div>
  )
}

export default ImageFrame;