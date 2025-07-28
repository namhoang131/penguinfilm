"use client"
import { Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import MobileNavigation from "./mobile-navigation"
import SearchHistory from "./search-history"
import LoadingAnimation from "./loading-animation"
import PenguinLogo from "./penguin-logo"

interface ResponsiveHeaderProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedGenre: string
  onGenreChange: (genre: string) => void
  statusFilter: string
  onStatusChange: (status: string) => void
  viewMode: "grid" | "list" | "3d"
  onViewModeChange: (mode: "grid" | "list" | "3d") => void
  sortBy: string
  onSortChange: (sort: string) => void
  isSearching?: boolean
  isRefreshing?: boolean
  onRefresh?: () => void
}

export default function ResponsiveHeader({
  searchTerm,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  isSearching = false,
  isRefreshing = false,
  onRefresh,
}: ResponsiveHeaderProps) {
  return (
    <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-blue-100">
      <div className="container mx-auto px-4 py-3">
        {/* Top Row - Logo and Actions */}
        <div className="flex items-center justify-between mb-4">
          {/* Left - Logo and Mobile Menu */}
          <div className="flex items-center gap-3">
            <MobileNavigation
              selectedGenre={selectedGenre}
              onGenreChange={onGenreChange}
              statusFilter={statusFilter}
              onStatusChange={onStatusChange}
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
              sortBy={sortBy}
              onSortChange={onSortChange}
            />

            <Link href="/movies" className="flex items-center gap-2">
              <PenguinLogo size="sm" animated={false} />
              <span className="text-xl md:text-2xl font-bold text-slate-700 font-['Poppins']">
                <span className="hidden sm:inline">Penguin Film</span>
                <span className="sm:hidden">PF</span>
              </span>
            </Link>
          </div>

          {/* Right - Desktop Navigation and User Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/history" className="text-slate-600 hover:text-blue-600 transition-colors">
                Lịch sử
              </Link>
              <Link href="/favorites" className="text-slate-600 hover:text-blue-600 transition-colors">
                Yêu thích
              </Link>
            </nav>

            {/* User Profile */}
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-blue-600">
                <User size={18} />
                <span className="hidden sm:inline ml-2">Đăng nhập</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <Input
            placeholder="Tìm kiếm phim..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-12 rounded-xl border-blue-200 focus:border-blue-400 text-sm md:text-base"
          />

          {/* Search Loading */}
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4">
                <LoadingAnimation size="sm" message="" />
              </div>
            </div>
          )}

          {/* Search History */}
          <SearchHistory onSearchSelect={onSearchChange} currentSearch={searchTerm} />
        </div>

        {/* Desktop Quick Filters - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2 mt-4">
          <span className="text-sm text-slate-600 mr-2">Thể loại:</span>
          {["all", "Hành động", "Lãng mạn", "Hài hước", "Phiêu lưu"].map((genre) => (
            <Button
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              size="sm"
              onClick={() => onGenreChange(genre)}
              className={`rounded-full text-xs ${
                selectedGenre === genre ? "bg-blue-400 hover:bg-blue-500" : "border-blue-200 hover:bg-blue-50"
              }`}
            >
              {genre === "all" ? "Tất cả" : genre}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
