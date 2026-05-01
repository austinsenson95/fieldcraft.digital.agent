"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { EASE, DURATION } from "@/lib/animations";

export interface VideoHeroProps {
  /** Video source URL (MP4/WebM). If omitted, CSS fallback is used. */
  videoSrc?: string;
  /** Poster image shown while video loads */
  posterSrc?: string;
  /** Primary headline */
  title: string;
  /** Optional subtitle / tagline */
  subtitle?: string;
  /** CTA button text */
  ctaText: string;
  /** CTA href */
  ctaHref: string;
  /** Theme-driven text color strategy */
  textTheme: "light" | "dark";
  /** Accent color for CTA (Tailwind class) */
  accentColor?: string;
  /** Accent hover color */
  accentHoverColor?: string;
  /** Optional CSS fallback class when no video is provided */
  fallbackClassName?: string;
}

export default function VideoHero({
  videoSrc,
  posterSrc,
  title,
  subtitle,
  ctaText,
  ctaHref,
  textTheme,
  accentColor = "bg-accent",
  accentHoverColor = "hover:bg-accent-hover",
  fallbackClassName,
}: VideoHeroProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const textColor = textTheme === "light" ? "text-text-primary" : "text-bg-primary";
  const mutedColor = textTheme === "light" ? "text-text-secondary" : "text-bg-primary/70";

  // IntersectionObserver: pause video when off-screen to save bandwidth/CPU
  useEffect(() => {
    if (!videoRef.current || !videoSrc) return;
    const video = videoRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (prefersReducedMotion) {
          video.pause();
          return;
        }
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [videoSrc, prefersReducedMotion]);

  // Visibility API: pause when tab is hidden
  useEffect(() => {
    if (!videoRef.current || !videoSrc) return;
    const video = videoRef.current;

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else if (!prefersReducedMotion) {
        video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [videoSrc, prefersReducedMotion]);

  const handleLoadedData = useCallback(() => {
    setVideoLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setVideoError(true);
  }, []);

  const showVideo = videoSrc && !videoError;
  const showFallback = !showVideo || !videoLoaded;

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] overflow-hidden"
      aria-label={`${title} showcase`}
    >
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        {showVideo && (
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={videoSrc}
            poster={posterSrc}
            autoPlay={!prefersReducedMotion}
            muted
            loop
            playsInline
            preload="metadata"
            onLoadedData={handleLoadedData}
            onError={handleError}
          />
        )}

        {/* CSS fallback / loading backdrop */}
        {showFallback && (
          <div
            className={`absolute inset-0 ${fallbackClassName ?? "bg-bg-primary"}`}
            aria-hidden="true"
          />
        )}

        {/* Gradient overlay for text legibility */}
        <div
          className={`absolute inset-0 ${
            textTheme === "light"
              ? "bg-gradient-to-t from-bg-primary/80 via-bg-primary/20 to-transparent"
              : "bg-gradient-to-t from-white/60 via-white/10 to-transparent"
          }`}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.2,
              },
            },
          }}
          className="max-w-4xl"
        >
          {subtitle && (
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: DURATION.normal, ease: EASE.entrance },
                },
              }}
              className={`text-sm md:text-base tracking-[0.2em] uppercase mb-6 ${mutedColor} font-[family-name:var(--font-geist-mono)]`}
            >
              {subtitle}
            </motion.p>
          )}

          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 28 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: DURATION.slow, ease: EASE.entrance },
              },
            }}
            className={`text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.05] ${textColor}`}
            style={{ letterSpacing: "-0.03em" }}
          >
            {title}
          </motion.h1>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: DURATION.normal, ease: EASE.entrance },
              },
            }}
            className="mt-10"
          >
            <a
              href={ctaHref}
              className={`inline-flex items-center gap-2 px-8 py-4 text-sm font-medium tracking-wide uppercase transition-all duration-300 ${accentColor} ${accentHoverColor} ${
                textTheme === "light" ? "text-bg-primary" : "text-text-primary"
              }`}
            >
              {ctaText}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              >
                <path
                  d="M3 8H13M13 8L9 4M13 8L9 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`w-5 h-8 rounded-full border-2 ${
            textTheme === "light" ? "border-text-primary/30" : "border-bg-primary/30"
          } flex justify-center pt-1.5`}
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1], y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className={`w-1 h-1.5 rounded-full ${
              textTheme === "light" ? "bg-text-primary/60" : "bg-bg-primary/60"
            }`}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
