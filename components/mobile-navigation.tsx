"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Home, Heart, Clock, User, Filter, Grid, List, Layers3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface MobileNavigationProps {
  selectedGenre: string
  onGenreChange: (genre: string) => void
  statusFilter: string
  onStatusChange: (status: string) => void
  viewMode: "grid" | "list" | "3d"
  onViewModeChange: (mode: "grid" | "list" | "3d") => void
  sortBy: string
  onSortChange: (sort: string) => void
}

export default function MobileNavigation({
  selectedGenre,
  onGenreChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"menu" | "genres" | "filters">("menu")

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
    { value: "recent", label: "Mới cập nhật" },
    { value: "name", label: "Tên A-Z" },
    { value: "year", label: "Năm mới nhất" },
    { value: "episodes", label: "Số tập" },
  ]

  const menuItems = [
    { href: "/movies", icon: Home, label: "Trang chủ" },
    { href: "/history", icon: Clock, label: "Lịch sử" },
    { href: "/favorites", icon: Heart, label: "Yêu thích" },
    { href: "/login", icon: User, label: "Đăng nhập" },
  ]

  const handleGenreSelect = (genre: string) => {
    onGenreChange(genre)
    setIsOpen(false)
  }

  const handleStatusSelect = (status: string) => {
    onStatusChange(status)
    setIsOpen(false)
  }

  return (
    <>
      {/* Hamburger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="ghost"
        size="sm"
        className="md:hidden text-slate-600 hover:text-blue-600 p-2"
      >
        <Menu size={20} />
      </Button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-md z-50 md:hidden overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-blue-100">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🐧</span>
                  <span className="font-bold text-slate-700 font-['Poppins']">Penguin Film</span>
                </div>
                <Button onClick={() => setIsOpen(false)} variant="ghost" size="sm">
                  <X size={20} />
                </Button>
              </div>

              {/* Tab Navigation */}
              <div className="flex border-b border-blue-100">
                {[
                  { id: "menu", label: "Menu", icon: Home },
                  { id: "genres", label: "Thể loại", icon: Filter },
                  { id: "filters", label: "Bộ lọc", icon: Grid },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                        : "text-slate-600 hover:text-blue-600"
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {activeTab === "menu" && (
                  <div className="space-y-2">
                    {menuItems.map((item) => (
                      <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors">
                          <item.icon size={20} className="text-slate-500" />
                          <span className="font-medium text-slate-700">{item.label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {activeTab === "genres" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">Thể loại phim</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {genres.map((genre) => (
                          <button
                            key={genre}
                            onClick={() => handleGenreSelect(genre)}
                            className={`p-3 rounded-xl text-sm font-medium transition-all ${
                              selectedGenre === genre
                                ? "bg-blue-500 text-white shadow-lg"
                                : "bg-slate-100 text-slate-700 hover:bg-blue-100"
                            }`}
                          >
                            {genre === "all" ? "Tất cả" : genre}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">Trạng thái</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusSelect(status)}
                            className={`p-3 rounded-xl text-sm font-medium transition-all ${
                              statusFilter === status
                                ? "bg-green-500 text-white shadow-lg"
                                : "bg-slate-100 text-slate-700 hover:bg-green-100"
                            }`}
                          >
                            {status === "all" ? "Tất cả trạng thái" : status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "filters" && (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">Chế độ xem</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { mode: "3d", icon: Layers3, label: "3D" },
                          { mode: "grid", icon: Grid, label: "Lưới" },
                          { mode: "list", icon: List, label: "Danh sách" },
                        ].map((view) => (
                          <button
                            key={view.mode}
                            onClick={() => {
                              onViewModeChange(view.mode as any)
                              setIsOpen(false)
                            }}
                            className={`p-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                              viewMode === view.mode
                                ? "bg-purple-500 text-white shadow-lg"
                                : "bg-slate-100 text-slate-700 hover:bg-purple-100"
                            }`}
                          >
                            <view.icon size={20} />
                            {view.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">Sắp xếp theo</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              onSortChange(option.value)
                              setIsOpen(false)
                            }}
                            className={`p-3 rounded-xl text-sm font-medium transition-all ${
                              sortBy === option.value
                                ? "bg-orange-500 text-white shadow-lg"
                                : "bg-slate-100 text-slate-700 hover:bg-orange-100"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Filters Display */}
              {(selectedGenre !== "all" || statusFilter !== "all") && (
                <div className="p-4 border-t border-blue-100 bg-blue-50">
                  <h5 className="text-sm font-semibold text-slate-700 mb-2">Bộ lọc đang áp dụng:</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedGenre !== "all" && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {selectedGenre}
                      </Badge>
                    )}
                    {statusFilter !== "all" && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        {statusFilter}
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
