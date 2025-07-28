"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, X, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SearchHistoryProps {
  onSearchSelect: (term: string) => void
  currentSearch: string
}

export default function SearchHistory({ onSearchSelect, currentSearch }: SearchHistoryProps) {
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("penguin-search-history") || "[]")
    setSearchHistory(history)
  }, [])

  const addToHistory = (term: string) => {
    if (!term.trim() || term.length < 2) return

    const history = JSON.parse(localStorage.getItem("penguin-search-history") || "[]")
    const newHistory = [term, ...history.filter((item: string) => item !== term)].slice(0, 10)

    localStorage.setItem("penguin-search-history", JSON.stringify(newHistory))
    setSearchHistory(newHistory)
  }

  const removeFromHistory = (term: string) => {
    const newHistory = searchHistory.filter((item) => item !== term)
    localStorage.setItem("penguin-search-history", JSON.stringify(newHistory))
    setSearchHistory(newHistory)
  }

  const clearHistory = () => {
    localStorage.removeItem("penguin-search-history")
    setSearchHistory([])
    setShowHistory(false)
  }

  const handleSearchSelect = (term: string) => {
    onSearchSelect(term)
    addToHistory(term)
    setShowHistory(false)
  }

  // Add current search to history when user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentSearch && currentSearch.length >= 2) {
        addToHistory(currentSearch)
      }
    }, 2000)

    return () => clearTimeout(timer)
  }, [currentSearch])

  const filteredHistory = searchHistory.filter(
    (term) => term.toLowerCase().includes(currentSearch.toLowerCase()) && term !== currentSearch,
  )

  return (
    <div className="relative">
      {/* Search History Toggle */}
      {searchHistory.length > 0 && (
        <Button
          onClick={() => setShowHistory(!showHistory)}
          variant="ghost"
          size="sm"
          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 z-10"
        >
          <Clock size={16} />
        </Button>
      )}

      {/* Search History Dropdown */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-blue-100 z-50 max-h-80 overflow-y-auto"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-700 text-sm">Tìm kiếm gần đây</h4>
                <Button
                  onClick={clearHistory}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 p-1 h-auto"
                >
                  <Trash2 size={14} />
                </Button>
              </div>

              {filteredHistory.length > 0 ? (
                <div className="space-y-1">
                  {filteredHistory.map((term, index) => (
                    <motion.div
                      key={term}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between group hover:bg-blue-50 rounded-lg p-2 cursor-pointer"
                      onClick={() => handleSearchSelect(term)}
                    >
                      <div className="flex items-center gap-2">
                        <Search size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600">{term}</span>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeFromHistory(term)
                        }}
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 h-auto"
                      >
                        <X size={12} />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-500 text-sm">
                  {currentSearch ? "Không có lịch sử phù hợp" : "Chưa có lịch sử tìm kiếm"}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Suggestions */}
      {currentSearch.length >= 2 && filteredHistory.length > 0 && !showHistory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-full left-0 right-0 mt-1 z-40"
        >
          <div className="flex flex-wrap gap-1 p-2">
            {filteredHistory.slice(0, 3).map((term) => (
              <Badge
                key={term}
                variant="secondary"
                className="cursor-pointer hover:bg-blue-100 text-xs"
                onClick={() => handleSearchSelect(term)}
              >
                {term}
              </Badge>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
