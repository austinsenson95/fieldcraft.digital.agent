"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // IntersectionObserver to pause video when off-screen
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
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
  }, []);

  // Visibility API
  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] w-full items-center overflow-hidden"
    >
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          src="/videos/nature.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
        />
        {/* Dark gradient overlay for text legibility */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/40 to-bg-primary/20"
          aria-hidden="true"
        />
        {/* Fallback while video loads */}
        {!videoLoaded && (
          <div className="absolute inset-0 bg-bg-primary" aria-hidden="true" />
        )}
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex w-full flex-col justify-center px-6 md:px-10 lg:px-16">
        <div className="max-w-[720px]">
          <motion.p
            className="mb-6 font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.12em] text-text-muted uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            BESPOKE SOFTWARE PORTALS
          </motion.p>

          <motion.h1
            className="font-[family-name:var(--font-geist-sans)] text-4xl font-semibold leading-tight tracking-tight text-text-primary md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1,
            }}
          >
            Engineered around you.
          </motion.h1>

          <motion.p
            className="mt-6 font-[family-name:var(--font-geist-sans)] text-xl leading-snug text-text-secondary md:text-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.25,
            }}
          >
            No templates. No compromises.
          </motion.p>

          <motion.p
            className="mt-8 max-w-[560px] text-lg leading-normal text-text-tertiary"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.4,
            }}
          >
            Fieldcraft Digital builds software portals tailored to how your business actually works.
          </motion.p>

          <motion.a
            href="#contact"
            className="mt-10 inline-block rounded-full bg-accent px-7 py-3.5 font-[family-name:var(--font-geist-mono)] text-sm tracking-wider text-bg-primary transition-all duration-200 ease-out hover:scale-[1.02] hover:bg-accent-hover"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.55,
            }}
          >
            Start a Conversation
          </motion.a>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolled ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative h-12 w-px overflow-hidden bg-text-muted/30">
          <motion.div
            className="absolute top-0 left-0 h-3 w-full bg-text-muted"
            animate={{ y: [0, 36, 0], opacity: [1, 0, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}
