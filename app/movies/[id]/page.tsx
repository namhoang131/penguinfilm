"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Heart, ArrowLeft, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import moviesData from "../../../movies/movies.json"
import EnhancedVideoPlayer from "@/components/enhanced-video-player"
import EpisodeComments from "./components/episode-comments"
import MovieTrailerModal from "@/components/movie-trailer-modal"
import MovieRatingSystem from "@/components/movie-rating-system"
import MovieWatchlist from "@/components/movie-watchlist"
import MovieProgressTracker from "@/components/movie-progress-tracker"
import MovieSocialFeatures from "@/components/movie-social-features"
import MovieRecommendationEngine from "@/components/movie-recommendation-engine"
import Footer from "@/components/footer"

interface PageProps {
  params: { id: string }
}

export default function MovieDetailPage({ params }: PageProps) {
  const [movie, setMovie] = useState<any>(null)
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    const foundMovie = moviesData.find((m) => m.id === params.id)
    setMovie(foundMovie)

    // Check if movie is in favorites
    const favorites = JSON.parse(localStorage.getItem("penguin-favorites") || "[]")
    setIsFavorite(favorites.includes(params.id))
  }, [params.id])

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("penguin-favorites") || "[]")
    let newFavorites

    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== params.id)
    } else {
      newFavorites = [...favorites, params.id]
    }

    localStorage.setItem("penguin-favorites", JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  const playEpisode = (episodeNumber: number) => {
    setSelectedEpisode(episodeNumber)

    // Save to watch history
    const history = JSON.parse(localStorage.getItem("penguin-history") || "[]")
    const historyItem = {
      movieId: params.id,
      movieTitle: movie.title,
      episode: episodeNumber,
      timestamp: Date.now(),
      poster: movie.poster,
    }

    const newHistory = [
      historyItem,
      ...history.filter((item: any) => !(item.movieId === params.id && item.episode === episodeNumber)),
    ].slice(0, 50)

    localStorage.setItem("penguin-history", JSON.stringify(newHistory))
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🐧</div>
            <h3 className="text-xl text-slate-600">Không tìm thấy phim</h3>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex flex-col">
      {/* Hero Section with Background */}
      <div className="relative h-96 overflow-hidden">
        <Image
          src={`/movies/${movie.id}/thumbnail.jpg`}
          alt={movie.title}
          fill
          className="object-cover blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        {/* Navigation */}
        <div className="absolute top-4 left-4 z-10">
          <Link href="/movies">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 rounded-xl">
              <ArrowLeft className="mr-2" size={16} />
              Quay lại
            </Button>
          </Link>
        </div>

        {/* Movie Info */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="container mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Poppins']">{movie.title}</h1>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="text-sm">
                  <Calendar className="mr-1" size={14} />
                  {movie.year}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  <Clock className="mr-1" size={14} />
                  {movie.episodes.length} tập
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  {movie.status}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genre.map((g: string) => (
                  <Badge key={g} variant="outline" className="text-white border-white/30">
                    {g}
                  </Badge>
                ))}
              </div>
              <p className="text-lg text-gray-200 max-w-2xl mb-6 font-['Nunito']">{movie.description}</p>
              <div className="flex gap-4 flex-wrap">
                <Button onClick={() => playEpisode(1)} size="lg" className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                  <Play className="mr-2" size={20} />
                  Xem ngay
                </Button>

                <Button
                  onClick={() => setShowTrailer(true)}
                  variant="outline"
                  size="lg"
                  className="rounded-xl border-white/30 text-white hover:bg-white/20"
                >
                  <Play className="mr-2" size={20} />
                  Trailer
                </Button>

                <Button
                  onClick={toggleFavorite}
                  variant="outline"
                  size="lg"
                  className={`rounded-xl border-white/30 text-white hover:bg-white/20 ${
                    isFavorite ? "bg-red-500/20 border-red-400" : ""
                  }`}
                >
                  <Heart className={`mr-2 ${isFavorite ? "fill-red-400 text-red-400" : ""}`} size={20} />
                  {isFavorite ? "Đã thích" : "Yêu thích"}
                </Button>

                <MovieWatchlist movieId={movie.id} movieTitle={movie.title} moviePoster={movie.poster} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* Video Player */}
        {selectedEpisode && (
          <div className="container mx-auto px-4 py-8">
            <EnhancedVideoPlayer
              movieId={movie.id}
              episode={selectedEpisode}
              movieTitle={movie.title}
              episodes={movie.episodes}
              onEpisodeChange={setSelectedEpisode}
            />
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Episodes Grid */}
              <div>
                <h2 className="text-2xl font-bold text-slate-700 mb-6 font-['Poppins']">Danh sách tập phim</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {movie.episodes.map((episode: any) => (
                    <motion.div
                      key={episode.episode}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="cursor-pointer group"
                      onClick={() => playEpisode(episode.episode)}
                    >
                      <div
                        className={`
                        relative rounded-xl overflow-hidden transition-all duration-300 shadow-lg
                        ${
                          selectedEpisode === episode.episode
                            ? "ring-2 ring-blue-400 shadow-blue-200"
                            : "hover:shadow-xl"
                        }
                      `}
                      >
                        {/* Episode Thumbnail */}
                        <div className="aspect-video relative">
                          <Image
                            src={`/movies/${movie.id}/ep${episode.episode}_thumb.jpg`}
                            alt={`${movie.title} - Tập ${episode.episode}`}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              // Fallback to movie thumbnail
                              e.currentTarget.src = `/movies/${movie.id}/thumbnail.jpg`
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                              <Play className="text-white ml-1" size={20} />
                            </div>
                          </div>

                          {/* Episode Number */}
                          <Badge className="absolute top-2 left-2 bg-black/50 text-white border-0">
                            Tập {episode.episode}
                          </Badge>
                        </div>

                        {/* Episode Info */}
                        <div className="p-3 bg-white/80 backdrop-blur-sm">
                          <h4 className="font-semibold text-sm text-slate-700 line-clamp-1 mb-1">{episode.title}</h4>
                          <div className="text-xs text-slate-500">24 phút</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* AI Recommendations */}
              <MovieRecommendationEngine currentMovieId={movie.id} />

              {/* Episode Comments */}
              {selectedEpisode && (
                <div className="container mx-auto px-4">
                  <EpisodeComments movieId={movie.id} episode={selectedEpisode} />
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Movie Rating */}
              <MovieRatingSystem movieId={movie.id} movieTitle={movie.title} />

              {/* Progress Tracker */}
              <MovieProgressTracker movieId={movie.id} episodes={movie.episodes} />

              {/* Social Features */}
              <MovieSocialFeatures movieId={movie.id} movieTitle={movie.title} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Trailer Modal */}
      <MovieTrailerModal movie={movie} isOpen={showTrailer} onClose={() => setShowTrailer(false)} />
    </div>
  )
}
