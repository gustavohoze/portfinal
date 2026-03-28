"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import styles from "./SafeImage.module.css";

export default function SafeImage({ src, alt, className, ...props }: ImageProps) {
  const [failed, setFailed] = useState(false);

  // If no source is provided at all, or if the image failed to load, show generic placeholder
  if (!src || failed) {
    return (
      <div 
        className={`${styles.placeholder} ${className || ""}`}
        style={props.fill ? { position: "absolute", inset: 0 } : { width: "100%", height: "100%" }}
      >
        <span className={styles.icon}>⊘</span>
        <span className={styles.text}>Image unavailable</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      {...props}
    />
  );
}
