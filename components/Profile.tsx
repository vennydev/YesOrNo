'use client'

import Image from "next/image";

type ProfileProps = {
  image: string
  alt: string
  width: number
  height: number
}

export default function Profile({ image, alt, width, height } : ProfileProps) {
  return (
    <Image src={image} alt={alt} width={width} height={height}/>
  )
}