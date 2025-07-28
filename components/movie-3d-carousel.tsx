"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Heart, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface Movie3DCarouselProps {
  movies: any[]
  onMovieSelect?: (movie: any) => void
}

export default function Movie3DCarousel({ movies, onMovieSelect }: Movie3DCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, movies.length])

  const nextMovie = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length)
    setIsAutoPlaying(false)
  }

  const prevMovie = () => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length)
    setIsAutoPlaying(false)
  }

  const goToMovie = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
  }

  const getVisibleMovies = () => {
    const visible = []
    for (let i = -2; i <= 2; i++) {
      const index = (currentIndex + i + movies.length) % movies.length
      visible.push({ ...movies[index], position: i, index })
    }
    return visible
  }

  const getTransform = (position: number) => {
    const baseTranslateX = position * 280
    const scale = position === 0 ? 1 : 0.8
    const rotateY = position * -15
    const translateZ = position === 0 ? 0 : -100
    const opacity = Math.abs(position) > 2 ? 0 : 1

    return {
      transform: `translateX(${baseTranslateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      zIndex: position === 0 ? 10 : 5 - Math.abs(position),
    }
  }

  if (movies.length === 0) return null

  const currentMovie = movies[currentIndex]

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gradient-to-b from-transparent to-black/20 rounded-2xl">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src={currentMovie.poster || "/placeholder.svg"}
          alt={currentMovie.title}
          fill
          className="object-cover blur-xl scale-110 opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* 3D Carousel Container */}
      <div
        className="relative h-full flex items-center justify-center perspective-1000"
        style={{ perspective: "1000px" }}
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div className="relative w-full h-96 flex items-center justify-center">
          <AnimatePresence mode="sync">
            {getVisibleMovies().map((movie) => (
              <motion.div
                key={`${movie.id}-${movie.position}`}
                className="absolute cursor-pointer group"
                style={getTransform(movie.position)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: getTransform(movie.position).opacity }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                onClick={() => (movie.position === 0 ? onMovieSelect?.(movie) : goToMovie(movie.index))}
              >
                <div className="relative w-64 h-96 rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-300">
                  {/* Movie Poster */}
                  <Image
                    src={movie.poster || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Movie Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg mb-2 font-['Poppins'] line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0 text-xs">
                        {movie.year}
                      </Badge>
                      <Badge variant="secondary" className="bg-black/50 text-white border-0 text-xs">
                        {movie.episodes.length} tập
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {movie.genre.slice(0, 2).map((g: string) => (
                        <Badge key={g} variant="outline" className="text-white border-white/30 text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Hover Actions */}
                  {movie.position === 0 && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="flex gap-2">
                        <Link href={`/movies/${movie.id}`}>
                          <Button size="sm" className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                            <Play size={16} className="mr-1" />
                            Xem
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/30 text-white hover:bg-white/20 rounded-xl bg-transparent"
                        >
                          <Info size={16} />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {/* Center Movie Indicator */}
                  {movie.position === 0 && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-500 text-white border-0">Đang chọn</Badge>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <Button
        onClick={prevMovie}
        variant="ghost"
        size="lg"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full z-20"
      >
        <ChevronLeft size={24} />
      </Button>

      <Button
        onClick={nextMovie}
        variant="ghost"
        size="lg"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full z-20"
      >
        <ChevronRight size={24} />
      </Button>

      {/* Movie Info Panel */}
      <div className="absolute bottom-8 left-8 right-8 z-20">
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2 font-['Poppins']">{currentMovie.title}</h2>
              <p className="text-white/80 text-sm mb-4 line-clamp-2 font-['Nunito'] max-w-2xl">
                {currentMovie.description}
              </p>
              <div className="flex items-center gap-4">
                <Link href={`/movies/${currentMovie.id}`}>
                  <Button size="lg" className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                    <Play className="mr-2" size={20} />
                    Xem ngay
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/20 rounded-xl bg-transparent"
                >
                  <Heart className="mr-2" size={20} />
                  Yêu thích
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {movies.slice(0, Math.min(movies.length, 10)).map((_, index) => (
          <button
            key={index}
            onClick={() => goToMovie(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
        {movies.length > 10 && <span className="text-white/50 text-xs ml-2">+{movies.length - 10}</span>}
      </div>

      {/* Auto-play Indicator */}
      <div className="absolute top-4 right-4 z-20">
        <Button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20 rounded-full"
        >
          <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? "bg-green-400" : "bg-red-400"}`} />
          <span className="ml-2 text-xs">{isAutoPlaying ? "Auto" : "Manual"}</span>
        </Button>
      </div>
    </div>
  )
}
