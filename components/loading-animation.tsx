"use client"

import { motion } from "framer-motion"
import { Snowflake } from "lucide-react"

interface LoadingAnimationProps {
  message?: string
  size?: "sm" | "md" | "lg"
}

export default function LoadingAnimation({ message = "Đang tải...", size = "md" }: LoadingAnimationProps) {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      {/* Animated Penguin */}
      <motion.div
        className={`relative ${sizeClasses[size]} mb-4`}
        animate={{
          rotate: [-5, 5, -5],
          y: [0, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-full relative shadow-2xl">
          {/* Penguin Body */}
          <div className="absolute inset-2 bg-white rounded-full">
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1/2 h-3/4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full"></div>
          </div>
          {/* Eyes */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full">
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-black rounded-full"></div>
          </div>
          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white rounded-full">
            <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-black rounded-full"></div>
          </div>
          {/* Beak */}
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-1 border-r-1 border-t-2 border-transparent border-t-orange-400"></div>
        </div>
      </motion.div>

      {/* Loading Dots */}
      <div className="flex space-x-1 mb-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-400 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <motion.p
        className={`${textSizes[size]} text-slate-600 font-['Nunito'] text-center`}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
        }}
      >
        {message}
      </motion.p>

      {/* Floating Snowflakes */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute text-blue-200"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              delay: Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          >
            <Snowflake size={12 + Math.random() * 8} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
