"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Layers3 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import moviesData from "../../movies/movies.json"
import MovieSections from "@/components/movie-sections"
import ResponsiveMovie3DCarousel from "@/components/responsive-movie-3d-carousel"
import ResponsiveHeader from "@/components/responsive-header"
import PageLoading from "@/components/page-loading"
import Footer from "@/components/footer"
import { useTouchGestures } from "@/hooks/use-touch-gestures"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export default function MoviesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "3d">("3d")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [filteredMovies, setFilteredMovies] = useState(moviesData)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showSections, setShowSections] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  // Touch gestures for mobile
  const touchGestures = useTouchGestures({
    onSwipeLeft: () => nextMovie(),
    onSwipeRight: () => prevMovie(),
    onSwipeDown: () => handlePullToRefresh(),
    threshold: 50,
  })

  // Initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    setIsSearching(true)

    const searchTimer = setTimeout(() => {
      let filtered = moviesData.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))

      if (selectedGenre !== "all") {
        filtered = filtered.filter((movie) => movie.genre.includes(selectedGenre))
      }

      if (statusFilter !== "all") {
        filtered = filtered.filter((movie) => movie.status === statusFilter)
      }

      // Sort movies
      switch (sortBy) {
        case "name":
          filtered.sort((a, b) => a.title.localeCompare(b.title))
          break
        case "year":
          filtered.sort((a, b) => b.year - a.year)
          break
        case "episodes":
          filtered.sort((a, b) => b.episodes.length - a.episodes.length)
          break
        case "recent":
        default:
          // Keep original order or add timestamp logic
          break
      }

      setFilteredMovies(filtered)
      setCurrentIndex(0)
      setShowSections(searchTerm === "" && selectedGenre === "all" && statusFilter === "all")
      setIsSearching(false)
    }, 300)

    return () => clearTimeout(searchTimer)
  }, [searchTerm, selectedGenre, statusFilter, sortBy])

  const nextMovie = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredMovies.length)
  }

  const prevMovie = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredMovies.length) % filteredMovies.length)
  }

  const handlePullToRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsRefreshing(false)
  }

  const handleMovieSelect = (movie: any) => {
    // Add to history and navigate
    const history = JSON.parse(localStorage.getItem("penguin-history") || "[]")
    const historyItem = {
      movieId: movie.id,
      movieTitle: movie.title,
      episode: 1,
      timestamp: Date.now(),
      poster: movie.poster,
    }

    const newHistory = [historyItem, ...history.filter((item: any) => item.movieId !== movie.id)].slice(0, 50)

    localStorage.setItem("penguin-history", JSON.stringify(newHistory))
    window.location.href = `/movies/${movie.id}`
  }

  const ResponsiveMovieGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
      {filteredMovies.map((movie, index) => (
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
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
                    <Play size={14} className="mr-1" />
                    <span className="hidden sm:inline">Xem</span>
                  </Button>
                </div>

                <Badge className="absolute top-2 left-2 bg-black/50 text-white border-0 text-xs">{movie.year}</Badge>
              </div>

              <div className="p-2 md:p-3">
                <h3 className="font-bold text-xs md:text-sm text-slate-700 mb-1 font-['Poppins'] line-clamp-1">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {movie.episodes.length} tập
                  </Badge>
                  <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                    {movie.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {movie.genre.slice(0, window.innerWidth < 640 ? 1 : 2).map((g: string) => (
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
  )

  const ResponsiveMovieList = () => (
    <div className="space-y-3 md:space-y-4">
      {filteredMovies.map((movie, index) => (
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Link href={`/movies/${movie.id}`}>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 md:p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:scale-[1.02]">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="relative w-16 h-24 md:w-20 md:h-28 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={movie.poster || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm md:text-lg text-slate-700 mb-1 md:mb-2 font-['Poppins'] truncate">
                    {movie.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 mb-2 line-clamp-2 font-['Nunito'] hidden md:block">
                    {movie.description}
                  </p>
                  <div className="flex items-center gap-1 md:gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {movie.year}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {movie.episodes.length} tập
                    </Badge>
                    <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                      {movie.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {movie.genre.slice(0, 3).map((g: string) => (
                      <Badge key={g} variant="outline" className="text-xs">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="bg-blue-500 hover:bg-blue-600 rounded-xl flex-shrink-0" size="sm">
                  <Play size={14} className="mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Xem ngay</span>
                  <span className="sm:hidden">Xem</span>
                </Button>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )

  if (isLoading) {
    return <PageLoading message="Đang tải Penguin Film..." />
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex flex-col"
      {...touchGestures}
    >
      {/* Responsive Header */}
      <ResponsiveHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        onSortChange={setSortBy}
        isSearching={isSearching}
        isRefreshing={isRefreshing}
        onRefresh={handlePullToRefresh}
      />

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
          {showSections && viewMode === "3d" ? (
            <div className="space-y-8 md:space-y-12">
              {/* 3D Carousel */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-700 mb-4 md:mb-6 font-['Poppins'] flex items-center">
                  <Layers3 className="mr-2" size={20} />
                  Phim nổi bật
                </h2>
                <ResponsiveMovie3DCarousel movies={moviesData.slice(0, 10)} onMovieSelect={handleMovieSelect} />
              </div>

              {/* Other Sections */}
              <MovieSections movies={moviesData} />
            </div>
          ) : filteredMovies.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-lg md:text-2xl font-bold text-slate-700 font-['Poppins']">
                  Kết quả ({filteredMovies.length})
                </h2>
              </div>

              {viewMode === "3d" ? (
                <ResponsiveMovie3DCarousel movies={filteredMovies} onMovieSelect={handleMovieSelect} />
              ) : viewMode === "grid" ? (
                <ResponsiveMovieGrid />
              ) : (
                <ResponsiveMovieList />
              )}
            </div>
          ) : (
            <div className="text-center py-12 md:py-20">
              <div className="text-4xl md:text-6xl mb-4">🐧</div>
              <h3 className="text-lg md:text-xl text-slate-600 mb-2">Không tìm thấy phim nào</h3>
              <p className="text-sm md:text-base text-slate-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Gesture Hints */}
      <div className="fixed bottom-4 left-4 right-4 md:hidden z-40">
        <div className="bg-black/50 text-white text-xs p-2 rounded-lg text-center backdrop-blur-sm">
          Vuốt trái/phải: Chuyển phim | Vuốt xuống: Làm mới
        </div>
      </div>
    </div>
  )
}
