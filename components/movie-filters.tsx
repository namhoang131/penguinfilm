"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Filter, Grid, List, SortAsc, Calendar, Hash, Clock, Layers3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface MovieFiltersProps {
  selectedGenre: string
  onGenreChange: (genre: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  viewMode: "grid" | "list" | "3d"
  onViewModeChange: (mode: "grid" | "list" | "3d") => void
  statusFilter: string
  onStatusChange: (status: string) => void
}

export default function MovieFilters({
  selectedGenre,
  onGenreChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  statusFilter,
  onStatusChange,
}: MovieFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const genres = [
    "all",
    "Hành động",
    "Huyền bí",
    "Lãng mạn",
    "Phiêu lưu",
    "Học đường",
    "Chính kịch",
    "Hài hước",
    "Võ thuật",
  ]
  const statuses = ["all", "Hoàn thành", "Đang phát sóng", "Phim lẻ"]
  const sortOptions = [
    { value: "name", label: "Tên A-Z", icon: SortAsc },
    { value: "year", label: "Năm mới nhất", icon: Calendar },
    { value: "episodes", label: "Số tập", icon: Hash },
    { value: "recent", label: "Mới cập nhật", icon: Clock },
  ]

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="rounded-xl border-blue-200 hover:bg-blue-50"
          >
            <Filter size={16} className="mr-2" />
            Bộ lọc
          </Button>

          {/* Quick Genre Filters */}
          <div className="hidden md:flex gap-2">
            {genres.slice(0, 5).map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => onGenreChange(genre)}
                className={`rounded-xl ${
                  selectedGenre === genre ? "bg-blue-400 hover:bg-blue-500" : "border-blue-200 hover:bg-blue-50"
                }`}
              >
                {genre === "all" ? "Tất cả" : genre}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-blue-200 hover:bg-blue-50 bg-transparent"
              >
                {(() => {
                  const IconComponent = sortOptions.find((opt) => opt.value === sortBy)?.icon
                  return IconComponent ? <IconComponent size={16} className="mr-2" /> : null
                })()}
                {sortOptions.find((opt) => opt.value === sortBy)?.label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-xl">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                  className="cursor-pointer"
                >
                  {(() => {
                    const IconComponent = option.icon
                    return IconComponent ? <IconComponent size={16} className="mr-2" /> : null
                  })()}
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Mode Toggle */}
          <div className="flex rounded-xl border border-blue-200 overflow-hidden">
            <Button
              onClick={() => onViewModeChange("3d")}
              variant={viewMode === "3d" ? "default" : "ghost"}
              size="sm"
              className={`rounded-none ${viewMode === "3d" ? "bg-blue-400" : ""}`}
            >
              <Layers3 size={16} />
            </Button>
            <Button
              onClick={() => onViewModeChange("grid")}
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className={`rounded-none ${viewMode === "grid" ? "bg-blue-400" : ""}`}
            >
              <Grid size={16} />
            </Button>
            <Button
              onClick={() => onViewModeChange("list")}
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className={`rounded-none ${viewMode === "list" ? "bg-blue-400" : ""}`}
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20"
          >
            <div className="space-y-4">
              {/* All Genres */}
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Thể loại</h4>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <Button
                      key={genre}
                      variant={selectedGenre === genre ? "default" : "outline"}
                      size="sm"
                      onClick={() => onGenreChange(genre)}
                      className={`rounded-xl ${
                        selectedGenre === genre ? "bg-blue-400 hover:bg-blue-500" : "border-blue-200 hover:bg-blue-50"
                      }`}
                    >
                      {genre === "all" ? "Tất cả" : genre}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <h4 className="font-semibold text-slate-700 mb-2">Trạng thái</h4>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((status) => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => onStatusChange(status)}
                      className={`rounded-xl ${
                        statusFilter === status
                          ? "bg-green-400 hover:bg-green-500"
                          : "border-green-200 hover:bg-green-50"
                      }`}
                    >
                      {status === "all" ? "Tất cả" : status}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filters */}
      {(selectedGenre !== "all" || statusFilter !== "all") && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Đang lọc:</span>
          {selectedGenre !== "all" && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {selectedGenre}
              <Button
                onClick={() => onGenreChange("all")}
                variant="ghost"
                size="sm"
                className="ml-1 p-0 h-auto text-blue-700 hover:text-blue-900"
              >
                ×
              </Button>
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {statusFilter}
              <Button
                onClick={() => onStatusChange("all")}
                variant="ghost"
                size="sm"
                className="ml-1 p-0 h-auto text-green-700 hover:text-green-900"
              >
                ×
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
