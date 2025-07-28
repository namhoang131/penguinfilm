"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Snowflake } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import PenguinLogo from "@/components/penguin-logo"

export default function LandingPage() {
  const [snowflakes, setSnowflakes] = useState<Array<{ id: number; x: number; delay: number }>>([])

  useEffect(() => {
    const flakes = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 5,
    }))
    setSnowflakes(flakes)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 relative overflow-hidden">
      {/* Snowfall Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {snowflakes.map((flake) => (
          <motion.div
            key={flake.id}
            className="absolute text-blue-200"
            style={{ left: `${flake.x}%` }}
            animate={{
              y: ["0vh", "100vh"],
              rotate: [0, 360],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              delay: flake.delay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            <Snowflake size={12 + Math.random() * 8} />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Animated Penguin Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring", bounce: 0.5 }}
          className="mb-8"
        >
          <PenguinLogo size="xl" animated={true} />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-700 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4 font-['Poppins']">
            Penguin Film
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-slate-600 mb-2 font-['Nunito']">
              Trang web chuyên vietsub phim hoạt hình Trung Quốc (donghua) chất lượng cao
            </p>
            <p className="text-lg text-slate-500 font-['Nunito']">
              Được thực hiện và biên tập bởi nhóm Penguin Vietsub
            </p>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <Link href="/movies">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-['Poppins']"
            >
              <Play className="mr-2" size={20} />
              Bắt đầu khám phá
            </Button>
          </Link>
        </motion.div>

        {/* Decorative Ice Crystals */}
        <div className="absolute top-20 left-20 text-blue-200 opacity-30">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Snowflake size={40} />
          </motion.div>
        </div>
        <div className="absolute bottom-20 right-20 text-cyan-200 opacity-30">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Snowflake size={60} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
