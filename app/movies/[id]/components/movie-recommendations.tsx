"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import moviesData from "../../../../movies/movies.json"

interface MovieRecommendationsProps {
  currentMovieId: string
  currentGenres: string[]
}

export default function MovieRecommendations({ currentMovieId, currentGenres }: MovieRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    // Get recommendations based on genre similarity
    const otherMovies = moviesData.filter((movie) => movie.id !== currentMovieId)

    const scored = otherMovies.map((movie) => {
      const genreMatches = movie.genre.filter((g) => currentGenres.includes(g)).length
      const score = genreMatches + Math.random() * 0.5 // Add some randomness
      return { ...movie, score }
    })

    const sorted = scored.sort((a, b) => b.score - a.score).slice(0, 6)
    setRecommendations(sorted)
  }, [currentMovieId, currentGenres])

  if (recommendations.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold text-slate-700 mb-6 font-['Poppins']">Phim đề xuất</h2>
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
              <div className="bg-white/60 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group-hover:scale-105">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={movie.poster || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                      <Play size={16} className="mr-1" />
                      Xem
                    </Button>
                  </div>
                </div>

                <div className="p-3">
                  <h3 className="font-bold text-sm text-slate-700 mb-1 font-['Poppins'] line-clamp-1">{movie.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {movie.year}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Clock size={10} className="mr-1" />
                      {movie.episodes.length}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {movie.genre.slice(0, 2).map((g: string) => (
                      <Badge key={g} variant="outline" className="text-xs">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
