"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Clock, Star, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface MovieSectionsProps {
  movies: any[]
}

export default function MovieSections({ movies }: MovieSectionsProps) {
  const [recentlyAdded, setRecentlyAdded] = useState<any[]>([])
  const [trending, setTrending] = useState<any[]>([])
  const [recommended, setRecommended] = useState<any[]>([])

  useEffect(() => {
    // Recently Added (simulate by sorting by year and taking recent ones)
    const recent = [...movies].sort((a, b) => b.year - a.year).slice(0, 6)
    setRecentlyAdded(recent)

    // Trending (simulate by episode count and random factor)
    const trendingMovies = [...movies]
      .map((movie) => ({
        ...movie,
        trendingScore: movie.episodes.length + Math.random() * 10,
      }))
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 6)
    setTrending(trendingMovies)

    // Recommended (based on user history)
    const history = JSON.parse(localStorage.getItem("penguin-history") || "[]")
    const watchedGenres = history.reduce((acc: string[], item: any) => {
      const movie = movies.find((m) => m.id === item.movieId)
      if (movie) {
        acc.push(...movie.genre)
      }
      return acc
    }, [])

    const genreCount = watchedGenres.reduce((acc: any, genre: string) => {
      acc[genre] = (acc[genre] || 0) + 1
      return acc
    }, {})

    const recommendedMovies = movies
      .filter((movie) => !history.some((h: any) => h.movieId === movie.id))
      .map((movie) => ({
        ...movie,
        recommendScore:
          movie.genre.reduce((score: number, genre: string) => {
            return score + (genreCount[genre] || 0)
          }, 0) + Math.random(),
      }))
      .sort((a, b) => b.recommendScore - a.recommendScore)
      .slice(0, 6)

    setRecommended(recommendedMovies)
  }, [movies])

  const MovieCard = ({ movie, index }: { movie: any; index: number }) => (
    <motion.div
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

            <Badge className="absolute top-2 left-2 bg-black/50 text-white border-0">{movie.year}</Badge>
          </div>

          <div className="p-3">
            <h3 className="font-bold text-sm text-slate-700 mb-1 font-['Poppins'] line-clamp-1">{movie.title}</h3>
            <div className="flex items-center gap-1 mb-2">
              <Badge variant="secondary" className="text-xs">
                {movie.episodes.length} tập
              </Badge>
              <Badge variant="outline" className="text-xs">
                {movie.status}
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
  )

  const Section = ({ title, movies, icon: Icon }: { title: string; movies: any[]; icon: any }) => (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-6">
        <Icon className="text-blue-500" size={24} />
        <h2 className="text-2xl font-bold text-slate-700 font-['Poppins']">{title}</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      {recentlyAdded.length > 0 && <Section title="Mới cập nhật" movies={recentlyAdded} icon={Clock} />}

      {trending.length > 0 && <Section title="Đang thịnh hành" movies={trending} icon={TrendingUp} />}

      {recommended.length > 0 && <Section title="Đề xuất cho bạn" movies={recommended} icon={Star} />}
    </div>
  )
}
