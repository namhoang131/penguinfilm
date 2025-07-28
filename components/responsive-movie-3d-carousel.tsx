"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Play, Heart, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"

interface ResponsiveMovie3DCarouselProps {
  movies: any[]
  onMovieSelect?: (movie: any) => void
}

export default function ResponsiveMovie3DCarousel({ movies, onMovieSelect }: ResponsiveMovie3DCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
    const visibleCount = isMobile ? 3 : 5 // Show fewer movies on mobile
    const range = Math.floor(visibleCount / 2)

    for (let i = -range; i <= range; i++) {
      const index = (currentIndex + i + movies.length) % movies.length
      visible.push({ ...movies[index], position: i, index })
    }
    return visible
  }

  const getTransform = (position: number) => {
    if (isMobile) {
      // Simplified mobile layout
      const baseTranslateX = position * 200
      const scale = position === 0 ? 1 : 0.7
      const opacity = Math.abs(position) > 1 ? 0 : 1

      return {
        transform: `translateX(${baseTranslateX}px) scale(${scale})`,
        opacity,
        zIndex: position === 0 ? 10 : 5 - Math.abs(position),
      }
    } else {
      // Full 3D effect for desktop
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
  }

  if (movies.length === 0) return null

  const currentMovie = movies[currentIndex]

  return (
    <div
      className={`relative w-full overflow-hidden bg-gradient-to-b from-transparent to-black/20 rounded-2xl ${
        isMobile ? "h-[500px]" : "h-[600px]"
      }`}
    >
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
        className={`relative h-full flex items-center justify-center ${!isMobile ? "perspective-1000" : ""}`}
        style={!isMobile ? { perspective: "1000px" } : {}}
        onMouseEnter={() => !isMobile && setIsAutoPlaying(false)}
        onMouseLeave={() => !isMobile && setIsAutoPlaying(true)}
      >
        <div className={`relative w-full flex items-center justify-center ${isMobile ? "h-80" : "h-96"}`}>
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
                <div
                  className={`relative rounded-2xl overflow-hidden shadow-2xl group-hover:shadow-3xl transition-all duration-300 ${
                    isMobile ? "w-48 h-72" : "w-64 h-96"
                  }`}
                >
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
                  <div className={`absolute bottom-0 left-0 right-0 text-white ${isMobile ? "p-3" : "p-4"}`}>
                    <h3 className={`font-bold mb-2 font-['Poppins'] line-clamp-1 ${isMobile ? "text-sm" : "text-lg"}`}>
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="bg-black/50 text-white border-0 text-xs">
                        {movie.year}
                      </Badge>
                      <Badge variant="secondary" className="bg-black/50 text-white border-0 text-xs">
                        {movie.episodes.length} tập
                      </Badge>
                    </div>
                    {!isMobile && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {movie.genre.slice(0, 2).map((g: string) => (
                          <Badge key={g} variant="outline" className="text-white border-white/30 text-xs">
                            {g}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Hover Actions */}
                  {movie.position === 0 && (
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className={`flex gap-2 ${isMobile ? "flex-col" : ""}`}>
                        <Link href={`/movies/${movie.id}`}>
                          <Button size={isMobile ? "sm" : "sm"} className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                            <Play size={16} className="mr-1" />
                            Xem
                          </Button>
                        </Link>
                        {!isMobile && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-white/30 text-white hover:bg-white/20 rounded-xl bg-transparent"
                          >
                            <Info size={16} />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Center Movie Indicator */}
                  {movie.position === 0 && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-blue-500 text-white border-0 text-xs">Đang chọn</Badge>
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
        size={isMobile ? "sm" : "lg"}
        className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full z-20"
      >
        <ChevronLeft size={isMobile ? 20 : 24} />
      </Button>

      <Button
        onClick={nextMovie}
        variant="ghost"
        size={isMobile ? "sm" : "lg"}
        className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full z-20"
      >
        <ChevronRight size={isMobile ? 20 : 24} />
      </Button>

      {/* Movie Info Panel - Responsive */}
      <div className={`absolute left-4 right-4 z-20 ${isMobile ? "bottom-4" : "bottom-8 left-8 right-8"}`}>
        <motion.div
          key={currentMovie.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 ${isMobile ? "p-4" : "p-6"}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className={`font-bold text-white mb-2 font-['Poppins'] ${isMobile ? "text-lg" : "text-2xl"}`}>
                {currentMovie.title}
              </h2>
              {!isMobile && (
                <p className="text-white/80 text-sm mb-4 line-clamp-2 font-['Nunito'] max-w-2xl">
                  {currentMovie.description}
                </p>
              )}
              <div className={`flex items-center gap-2 ${isMobile ? "flex-col items-start" : "gap-4"}`}>
                <Link href={`/movies/${currentMovie.id}`}>
                  <Button size={isMobile ? "sm" : "lg"} className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                    <Play className="mr-2" size={isMobile ? 16 : 20} />
                    Xem ngay
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "lg"}
                  className="border-white/30 text-white hover:bg-white/20 rounded-xl bg-transparent"
                >
                  <Heart className="mr-2" size={isMobile ? 16 : 20} />
                  Yêu thích
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Dots Indicator - Responsive */}
      <div
        className={`absolute left-1/2 transform -translate-x-1/2 flex gap-1 z-20 ${isMobile ? "bottom-2" : "bottom-4"}`}
      >
        {movies.slice(0, Math.min(movies.length, isMobile ? 5 : 10)).map((_, index) => (
          <button
            key={index}
            onClick={() => goToMovie(index)}
            className={`rounded-full transition-all duration-300 ${isMobile ? "w-1.5 h-1.5" : "w-2 h-2"} ${
              index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
            }`}
          />
        ))}
        {movies.length > (isMobile ? 5 : 10) && (
          <span className="text-white/50 text-xs ml-2">+{movies.length - (isMobile ? 5 : 10)}</span>
        )}
      </div>

      {/* Auto-play Indicator - Hidden on mobile */}
      {!isMobile && (
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
      )}
    </div>
  )
}
