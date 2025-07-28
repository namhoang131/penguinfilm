"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Play, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import moviesData from "../../movies/movies.json"

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [favoriteMovies, setFavoriteMovies] = useState<any[]>([])

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("penguin-favorites") || "[]")
    setFavorites(savedFavorites)

    const movies = moviesData.filter((movie) => savedFavorites.includes(movie.id))
    setFavoriteMovies(movies)
  }, [])

  const removeFavorite = (movieId: string) => {
    const newFavorites = favorites.filter((id) => id !== movieId)
    localStorage.setItem("penguin-favorites", JSON.stringify(newFavorites))
    setFavorites(newFavorites)
    setFavoriteMovies(favoriteMovies.filter((movie) => movie.id !== movieId))
  }

  const clearFavorites = () => {
    localStorage.removeItem("penguin-favorites")
    setFavorites([])
    setFavoriteMovies([])
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
                <Heart className="inline mr-3 text-red-500" size={32} />
                Phim yêu thích
              </h1>
            </div>
            {favoriteMovies.length > 0 && (
              <Button
                onClick={clearFavorites}
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

      {/* Favorites Grid */}
      <div className="container mx-auto px-4 py-8">
        {favoriteMovies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Hover Actions */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Link href={`/movies/${movie.id}`}>
                        <Button size="lg" className="bg-blue-500 hover:bg-blue-600 rounded-xl">
                          <Play className="mr-2" size={20} />
                          Xem ngay
                        </Button>
                      </Link>
                    </div>

                    {/* Remove Button */}
                    <Button
                      onClick={() => removeFavorite(movie.id)}
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-white hover:bg-red-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg text-slate-700 mb-2 font-['Poppins'] line-clamp-1">
                      {movie.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {movie.year}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {movie.episodes.length} tập
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {movie.genre.slice(0, 2).map((g: string) => (
                        <Badge key={g} variant="outline" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2 font-['Nunito']">{movie.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🐧💔</div>
            <h3 className="text-xl text-slate-600 mb-2">Chưa có phim yêu thích</h3>
            <p className="text-slate-500 mb-6">Thêm phim vào danh sách yêu thích để xem lại sau</p>
            <Link href="/movies">
              <Button className="bg-blue-500 hover:bg-blue-600 rounded-xl">Khám phá phim</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
