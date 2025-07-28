"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sparkles, TrendingUp, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import moviesData from "../movies/movies.json"

interface MovieRecommendationEngineProps {
  currentMovieId?: string
}

export default function MovieRecommendationEngine({ currentMovieId }: MovieRecommendationEngineProps) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [recommendationType, setRecommendationType] = useState<"ai" | "trending" | "friends" | "continue">("ai")

  useEffect(() => {
    generateRecommendations()
  }, [currentMovieId, recommendationType])

  const generateRecommendations = () => {
    const history = JSON.parse(localStorage.getItem("penguin-history") || "[]")
    const favorites = JSON.parse(localStorage.getItem("penguin-favorites") || "[]")
    const watchedMovieIds = [...new Set(history.map((h: any) => h.movieId))]

    let recs: any[] = []

    switch (recommendationType) {
      case "ai":
        // AI-based recommendations using viewing patterns
        const genrePreferences = getGenrePreferences(history)
        recs = moviesData
          .filter((movie) => !watchedMovieIds.includes(movie.id) && movie.id !== currentMovieId)
          .map((movie) => ({
            ...movie,
            score: calculateAIScore(movie, genrePreferences, favorites),
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 6)
        break

      case "trending":
        // Trending based on episode count and recency
        recs = moviesData
          .filter((movie) => movie.id !== currentMovieId)
          .map((movie) => ({
            ...movie,
            score: movie.episodes.length + (movie.year > 2020 ? 10 : 0) + Math.random() * 5,
          }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 6)
        break

      case "friends":
        // Simulate friends' recommendations
        recs = moviesData
          .filter((movie) => movie.id !== currentMovieId)
          .sort(() => Math.random() - 0.5)
          .slice(0, 6)
          .map((movie) => ({
            ...movie,
            friendName: ["Minh Anh", "Hoàng Nam", "Thu Hà"][Math.floor(Math.random() * 3)],
          }))
        break

      case "continue":
        // Continue watching
        recs = history
          .filter((h: any) => h.movieId !== currentMovieId)
          .slice(0, 6)
          .map((h: any) => {
            const movie = moviesData.find((m) => m.id === h.movieId)
            return movie ? { ...movie, lastEpisode: h.episode, lastWatched: h.timestamp } : null
          })
          .filter(Boolean)
        break
    }

    setRecommendations(recs)
  }

  const getGenrePreferences = (history: any[]) => {
    const genreCounts: { [key: string]: number } = {}

    history.forEach((item: any) => {
      const movie = moviesData.find((m) => m.id === item.movieId)
      if (movie) {
        movie.genre.forEach((genre: string) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1
        })
      }
    })

    return genreCounts
  }

  const calculateAIScore = (movie: any, genrePrefs: any, favorites: string[]) => {
    let score = 0

    // Genre matching
    movie.genre.forEach((genre: string) => {
      score += genrePrefs[genre] || 0
    })

    // Year bonus for newer content
    if (movie.year > 2020) score += 5
    if (movie.year > 2018) score += 2

    // Episode count consideration
    if (movie.episodes.length > 10) score += 3
    if (movie.episodes.length < 5) score += 1 // Sometimes short series are good

    // Random factor for diversity
    score += Math.random() * 3

    return score
  }

  const getRecommendationTitle = () => {
    switch (recommendationType) {
      case "ai":
        return "Đề xuất cho bạn"
      case "trending":
        return "Đang thịnh hành"
      case "friends":
        return "Bạn bè đề xuất"
      case "continue":
        return "Tiếp tục xem"
      default:
        return "Đề xuất"
    }
  }

  const getRecommendationIcon = () => {
    switch (recommendationType) {
      case "ai":
        return Sparkles
      case "trending":
        return TrendingUp
      case "friends":
        return Users
      case "continue":
        return Clock
      default:
        return Sparkles
    }
  }

  const RecommendationIcon = getRecommendationIcon()

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl text-slate-700 font-['Poppins'] flex items-center">
          <RecommendationIcon className="mr-2 text-blue-500" size={24} />
          {getRecommendationTitle()}
        </h3>

        {/* Recommendation Type Selector */}
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {[
            { type: "ai", icon: Sparkles, label: "AI" },
            { type: "trending", icon: TrendingUp, label: "Hot" },
            { type: "friends", icon: Users, label: "Bạn bè" },
            { type: "continue", icon: Clock, label: "Tiếp tục" },
          ].map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              onClick={() => setRecommendationType(type as any)}
              variant={recommendationType === type ? "default" : "ghost"}
              size="sm"
              className={`rounded-md ${recommendationType === type ? "bg-blue-500 text-white" : "text-slate-600"}`}
            >
              <Icon size={14} className="mr-1" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {recommendations.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link href={`/movies/${movie.id}`}>
              <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={movie.poster || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Special Badges */}
                  {recommendationType === "friends" && movie.friendName && (
                    <Badge className="absolute top-2 left-2 bg-purple-500 text-white text-xs">
                      {movie.friendName} đề xuất
                    </Badge>
                  )}

                  {recommendationType === "continue" && movie.lastEpisode && (
                    <Badge className="absolute top-2 left-2 bg-blue-500 text-white text-xs">
                      Tập {movie.lastEpisode}
                    </Badge>
                  )}

                  {recommendationType === "ai" && (
                    <Badge className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                      <Sparkles size={10} className="mr-1" />
                      AI Pick
                    </Badge>
                  )}
                </div>

                <div className="p-3 bg-white">
                  <h4 className="font-semibold text-sm text-slate-700 line-clamp-1 mb-1">{movie.title}</h4>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {movie.year}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {movie.episodes.length} tập
                    </Badge>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <RecommendationIcon size={48} className="mx-auto mb-2 opacity-50" />
          <p>Chưa có đề xuất nào</p>
        </div>
      )}
    </div>
  )
}
