'use client';

import Image from 'next/image';
import React from 'react';
import { cn } from '@/lib/utils';

interface ImageFrameProps extends React.ImgHTMLAttributes<typeof Image> {
  containerClassName?: string;
}

const ImageFrame = ({ className, src, width, height, alt, containerClassName }: ImageFrameProps) => {
  if (!src)
    throw new Error('ImageFrame requires a src prop');
  if (!width || Number.isNaN(width))
    throw new Error('ImageFrame requires a width prop');
  if (!height || Number.isNaN(height))
    throw new Error('ImageFrame requires a height prop');
  if (!alt)
    throw new Error('ImageFrame requires an alt prop');

  return (
    <div className={cn("rounded-lg bg-card-overview p-4 mt-[5rem] mx-4 border-2", containerClassName)}>
      <Image
        className={cn(``, className)}
        src={src}
        width={Number(width)}
        height={Number(height)}
        alt={alt}
      />
    </div>
  )
}

export default ImageFrame;