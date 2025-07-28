"use client"

import { motion } from "framer-motion"

interface PenguinLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  animated?: boolean
  className?: string
}

export default function PenguinLogo({ size = "md", animated = true, className = "" }: PenguinLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-24 h-24",
    xl: "w-32 h-32",
  }

  const LogoContent = () => (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br from-slate-800 to-slate-900 rounded-full relative shadow-2xl ${className}`}
    >
      {/* Penguin Body */}
      <div className="absolute inset-1 bg-white rounded-full">
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full ${
            size === "xl"
              ? "top-4 w-16 h-20"
              : size === "lg"
                ? "top-2 w-8 h-10"
                : size === "md"
                  ? "top-1.5 w-5 h-6"
                  : "top-1 w-3 h-4"
          }`}
        ></div>
      </div>

      {/* Eyes */}
      <div
        className={`absolute bg-white rounded-full ${
          size === "xl"
            ? "top-6 left-8 w-3 h-3"
            : size === "lg"
              ? "top-3 left-4 w-1.5 h-1.5"
              : size === "md"
                ? "top-2 left-2.5 w-1 h-1"
                : "top-1.5 left-1.5 w-0.5 h-0.5"
        }`}
      >
        <div
          className={`absolute bg-black rounded-full ${
            size === "xl"
              ? "top-0.5 left-0.5 w-2 h-2"
              : size === "lg"
                ? "top-0.5 left-0.5 w-1 h-1"
                : size === "md"
                  ? "top-0 left-0 w-0.5 h-0.5"
                  : "top-0 left-0 w-0.5 h-0.5"
          }`}
        ></div>
      </div>

      <div
        className={`absolute bg-white rounded-full ${
          size === "xl"
            ? "top-6 right-8 w-3 h-3"
            : size === "lg"
              ? "top-3 right-4 w-1.5 h-1.5"
              : size === "md"
                ? "top-2 right-2.5 w-1 h-1"
                : "top-1.5 right-1.5 w-0.5 h-0.5"
        }`}
      >
        <div
          className={`absolute bg-black rounded-full ${
            size === "xl"
              ? "top-0.5 left-0.5 w-2 h-2"
              : size === "lg"
                ? "top-0.5 left-0.5 w-1 h-1"
                : size === "md"
                  ? "top-0 left-0 w-0.5 h-0.5"
                  : "top-0 left-0 w-0.5 h-0.5"
          }`}
        ></div>
      </div>

      {/* Beak */}
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-transparent border-t-orange-400 ${
          size === "xl"
            ? "top-10 border-l-2 border-r-2 border-t-3"
            : size === "lg"
              ? "top-5 border-l-1 border-r-1 border-t-2"
              : size === "md"
                ? "top-3 border-l-1 border-r-1 border-t-1"
                : "top-2 border-l-0.5 border-r-0.5 border-t-1"
        }`}
      ></div>
    </div>
  )

  if (animated) {
    return (
      <motion.div
        animate={{
          rotate: [-2, 2, -2],
          y: [0, -5, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <LogoContent />
      </motion.div>
    )
  }

  return <LogoContent />
}
