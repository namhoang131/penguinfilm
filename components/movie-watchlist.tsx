"use client"

import { useState, useEffect } from "react"
import { Plus, Check, Bookmark, Clock, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MovieWatchlistProps {
  movieId: string
  movieTitle: string
  moviePoster: string
}

export default function MovieWatchlist({ movieId, movieTitle, moviePoster }: MovieWatchlistProps) {
  const [watchlists, setWatchlists] = useState<any[]>([])
  const [movieWatchlists, setMovieWatchlists] = useState<string[]>([])

  useEffect(() => {
    // Load watchlists from localStorage
    const savedWatchlists = JSON.parse(localStorage.getItem("penguin-watchlists") || "[]")

    // Create default watchlists if none exist
    if (savedWatchlists.length === 0) {
      const defaultWatchlists = [
        { id: "watch-later", name: "Xem sau", icon: Clock, movies: [] },
        { id: "favorites", name: "Yêu thích", icon: Bookmark, movies: [] },
        { id: "watching", name: "Đang xem", icon: Play, movies: [] },
      ]
      localStorage.setItem("penguin-watchlists", JSON.stringify(defaultWatchlists))
      setWatchlists(defaultWatchlists)
    } else {
      setWatchlists(savedWatchlists)
    }

    // Check which watchlists contain this movie
    const movieInWatchlists = savedWatchlists
      .filter((list: any) => list.movies.some((movie: any) => movie.id === movieId))
      .map((list: any) => list.id)
    setMovieWatchlists(movieInWatchlists)
  }, [movieId])

  const toggleMovieInWatchlist = (watchlistId: string) => {
    const updatedWatchlists = watchlists.map((list) => {
      if (list.id === watchlistId) {
        const movieExists = list.movies.some((movie: any) => movie.id === movieId)

        if (movieExists) {
          // Remove movie from watchlist
          return {
            ...list,
            movies: list.movies.filter((movie: any) => movie.id !== movieId),
          }
        } else {
          // Add movie to watchlist
          return {
            ...list,
            movies: [
              ...list.movies,
              {
                id: movieId,
                title: movieTitle,
                poster: moviePoster,
                addedAt: Date.now(),
              },
            ],
          }
        }
      }
      return list
    })

    setWatchlists(updatedWatchlists)
    localStorage.setItem("penguin-watchlists", JSON.stringify(updatedWatchlists))

    // Update movie watchlists
    const newMovieWatchlists = updatedWatchlists
      .filter((list: any) => list.movies.some((movie: any) => movie.id === movieId))
      .map((list: any) => list.id)
    setMovieWatchlists(newMovieWatchlists)
  }

  const createNewWatchlist = () => {
    const name = prompt("Tên danh sách mới:")
    if (name && name.trim()) {
      const newWatchlist = {
        id: `custom-${Date.now()}`,
        name: name.trim(),
        icon: Bookmark,
        movies: [],
        isCustom: true,
      }

      const updatedWatchlists = [...watchlists, newWatchlist]
      setWatchlists(updatedWatchlists)
      localStorage.setItem("penguin-watchlists", JSON.stringify(updatedWatchlists))
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className={`rounded-xl border-white/30 text-white hover:bg-white/20 ${
            movieWatchlists.length > 0 ? "bg-blue-500/20 border-blue-400" : ""
          }`}
        >
          {movieWatchlists.length > 0 ? (
            <>
              <Check className="mr-2" size={20} />
              Đã thêm ({movieWatchlists.length})
            </>
          ) : (
            <>
              <Plus className="mr-2" size={20} />
              Thêm vào danh sách
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 rounded-xl bg-white/90 backdrop-blur-md">
        <div className="p-2">
          <h4 className="font-semibold text-slate-700 mb-2 px-2">Thêm vào danh sách</h4>

          {watchlists.map((list) => {
            const isInList = movieWatchlists.includes(list.id)
            const IconComponent = list.icon

            return (
              <DropdownMenuItem
                key={list.id}
                onClick={() => toggleMovieInWatchlist(list.id)}
                className="cursor-pointer rounded-lg mb-1"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <IconComponent size={16} className="text-slate-500" />
                    <span>{list.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {list.movies.length}
                    </Badge>
                  </div>
                  {isInList && <Check size={16} className="text-green-500" />}
                </div>
              </DropdownMenuItem>
            )
          })}

          <hr className="my-2" />

          <DropdownMenuItem onClick={createNewWatchlist} className="cursor-pointer rounded-lg">
            <Plus size={16} className="mr-2" />
            Tạo danh sách mới
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
