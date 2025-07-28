"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Clock, Play, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("penguin-history") || "[]")
    setHistory(savedHistory)
  }, [])

  const clearHistory = () => {
    localStorage.removeItem("penguin-history")
    setHistory([])
  }

  const removeItem = (movieId: string, episode: number) => {
    const newHistory = history.filter((item) => !(item.movieId === movieId && item.episode === episode))
    localStorage.setItem("penguin-history", JSON.stringify(newHistory))
    setHistory(newHistory)
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-blue-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/movies" className="text-blue-600 hover:text-blue-700 mb-2 inline-block">
                ← Quay lại
              </Link>
              <h1 className="text-3xl font-bold text-slate-700 font-['Poppins']">
                <Clock className="inline mr-3" size={32} />
                Lịch sử xem
              </h1>
            </div>
            {history.length > 0 && (
              <Button
                onClick={clearHistory}
                variant="outline"
                className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
              >
                <Trash2 className="mr-2" size={16} />
                Xóa tất cả
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="container mx-auto px-4 py-8">
        {history.length > 0 ? (
          <div className="grid gap-4">
            {history.map((item, index) => (
              <motion.div
                key={`${item.movieId}-${item.episode}-${item.timestamp}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-24 h-36 rounded-xl overflow-hidden flex-shrink-0">
                    <Image
                      src={item.poster || "/placeholder.svg"}
                      alt={item.movieTitle}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-700 mb-2 font-['Poppins']">{item.movieTitle}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">Tập {item.episode}</Badge>
                      <span className="text-sm text-slate-500">{formatDate(item.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/movies/${item.movieId}`}>
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                          <Play className="mr-2" size={14} />
                          Tiếp tục xem
                        </Button>
                      </Link>
                      <Button
                        onClick={() => removeItem(item.movieId, item.episode)}
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐧</div>
            <h3 className="text-xl text-slate-600 mb-2">Chưa có lịch sử xem</h3>
            <p className="text-slate-500 mb-6">Bắt đầu xem phim để tạo lịch sử</p>
            <Link href="/movies">
              <Button className="bg-blue-500 hover:bg-blue-600 rounded-xl">Khám phá phim</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
