"use client"

import { motion } from "framer-motion"
import LoadingAnimation from "./loading-animation"

interface PageLoadingProps {
  message?: string
}

export default function PageLoading({ message = "Đang tải trang..." }: PageLoadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center z-50"
    >
      <div className="text-center">
        <LoadingAnimation message={message} size="lg" />

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-slate-200 rounded-full overflow-hidden mt-8">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  )
}
