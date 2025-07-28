"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, CheckCircle, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface MovieProgressTrackerProps {
  movieId: string
  episodes: any[]
}

export default function MovieProgressTracker({ movieId, episodes }: MovieProgressTrackerProps) {
  const [watchedEpisodes, setWatchedEpisodes] = useState<number[]>([])
  const [currentEpisode, setCurrentEpisode] = useState<number | null>(null)
  const [totalWatchTime, setTotalWatchTime] = useState(0)

  useEffect(() => {
    // Load progress from localStorage
    const progress = JSON.parse(localStorage.getItem(`penguin-progress-tracker-${movieId}`) || "{}")

    if (progress.watchedEpisodes) setWatchedEpisodes(progress.watchedEpisodes)
    if (progress.currentEpisode) setCurrentEpisode(progress.currentEpisode)
    if (progress.totalWatchTime) setTotalWatchTime(progress.totalWatchTime)

    // Load from history to determine watched episodes
    const history = JSON.parse(localStorage.getItem("penguin-history") || "[]")
    const movieHistory = history.filter((item: any) => item.movieId === movieId)
    const watchedEps = movieHistory.map((item: any) => item.episode)

    if (watchedEps.length > 0) {
      setWatchedEpisodes([...new Set(watchedEps)])
      setCurrentEpisode(Math.max(...watchedEps))
    }
  }, [movieId])

  const progressPercentage = (watchedEpisodes.length / episodes.length) * 100
  const isCompleted = watchedEpisodes.length === episodes.length

  const getWatchStatus = () => {
    if (isCompleted) return { text: "Đã hoàn thành", color: "text-green-600", icon: CheckCircle }
    if (watchedEpisodes.length > 0) return { text: "Đang xem", color: "text-blue-600", icon: Play }
    return { text: "Chưa xem", color: "text-slate-500", icon: Clock }
  }

  const status = getWatchStatus()
  const StatusIcon = status.icon

  const formatWatchTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg text-slate-700 font-['Poppins']">Tiến độ xem</h3>
        <Badge variant="secondary" className={`${status.color} bg-transparent border-current`}>
          <StatusIcon size={14} className="mr-1" />
          {status.text}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">
            {watchedEpisodes.length}/{episodes.length} tập
          </span>
          <span className="text-sm font-semibold text-slate-700">{Math.round(progressPercentage)}%</span>
        </div>

        <Progress value={progressPercentage} className="h-2 bg-slate-200" />
      </div>

      {/* Episode Grid */}
      <div className="grid grid-cols-6 gap-2 mb-4">
        {episodes.map((episode) => {
          const isWatched = watchedEpisodes.includes(episode.episode)
          const isCurrent = currentEpisode === episode.episode

          return (
            <motion.div
              key={episode.episode}
              whileHover={{ scale: 1.05 }}
              className={`
                relative w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold
                ${
                  isWatched
                    ? "bg-green-500 text-white"
                    : isCurrent
                      ? "bg-blue-500 text-white"
                      : "bg-slate-200 text-slate-600"
                }
                ${isCurrent ? "ring-2 ring-blue-300" : ""}
              `}
            >
              {episode.episode}
              {isWatched && (
                <CheckCircle size={10} className="absolute -top-1 -right-1 bg-white rounded-full text-green-500" />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-slate-700">Tập tiếp theo</div>
          <div className="text-slate-600">
            {isCompleted
              ? "Đã xem hết"
              : `Tập ${Math.min(...episodes.map((ep) => ep.episode).filter((ep) => !watchedEpisodes.includes(ep))) || episodes.length}`}
          </div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-slate-700">Thời gian xem</div>
          <div className="text-slate-600">
            {formatWatchTime(watchedEpisodes.length * 24)} {/* Assume 24min per episode */}
          </div>
        </div>
      </div>
    </div>
  )
}
