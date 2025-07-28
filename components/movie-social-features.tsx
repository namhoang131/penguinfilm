"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Share2, Users, MessageSquare, Trophy, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface MovieSocialFeaturesProps {
  movieId: string
  movieTitle: string
}

export default function MovieSocialFeatures({ movieId, movieTitle }: MovieSocialFeaturesProps) {
  const [watchParty, setWatchParty] = useState<any>(null)
  const [achievements, setAchievements] = useState<any[]>([])
  const [friendsWatching, setFriendsWatching] = useState<any[]>([])

  useEffect(() => {
    // Load social data
    const socialData = JSON.parse(localStorage.getItem(`penguin-social-${movieId}`) || "{}")

    // Simulate friends watching
    const mockFriends = [
      { id: 1, name: "Minh Anh", avatar: "MA", episode: 5, status: "watching" },
      { id: 2, name: "Hoàng Nam", avatar: "HN", episode: 3, status: "completed" },
      { id: 3, name: "Thu Hà", avatar: "TH", episode: 7, status: "watching" },
    ]
    setFriendsWatching(mockFriends)

    // Load achievements
    const userAchievements = JSON.parse(localStorage.getItem("penguin-achievements") || "[]")
    setAchievements(userAchievements)
  }, [movieId])

  const shareMovie = async () => {
    const shareData = {
      title: `${movieTitle} - Penguin Film`,
      text: `Tôi đang xem ${movieTitle} trên Penguin Film! Cùng xem nhé 🐧`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
      // Show toast notification here
    }
  }

  const createWatchParty = () => {
    const partyCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const newWatchParty = {
      id: partyCode,
      host: "Bạn",
      movieId,
      movieTitle,
      participants: ["Bạn"],
      createdAt: Date.now(),
    }

    setWatchParty(newWatchParty)
    localStorage.setItem(`penguin-watch-party-${partyCode}`, JSON.stringify(newWatchParty))
  }

  const joinWatchParty = () => {
    const code = prompt("Nhập mã Watch Party:")
    if (code) {
      const party = localStorage.getItem(`penguin-watch-party-${code.toUpperCase()}`)
      if (party) {
        setWatchParty(JSON.parse(party))
      } else {
        alert("Không tìm thấy Watch Party với mã này!")
      }
    }
  }

  return (
    <div className="space-y-4">
      {/* Social Actions */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <h3 className="font-bold text-lg text-slate-700 mb-4 font-['Poppins']">Tính năng xã hội</h3>

        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={shareMovie}
            variant="outline"
            className="rounded-xl border-blue-200 hover:bg-blue-50 bg-transparent"
          >
            <Share2 size={16} className="mr-2" />
            Chia sẻ
          </Button>

          <Button
            onClick={createWatchParty}
            variant="outline"
            className="rounded-xl border-purple-200 hover:bg-purple-50 bg-transparent"
          >
            <Users size={16} className="mr-2" />
            Watch Party
          </Button>
        </div>

        {watchParty && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-purple-700">Watch Party Active</div>
                <div className="text-sm text-purple-600">Mã: {watchParty.id}</div>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {watchParty.participants.length} người
              </Badge>
            </div>
          </motion.div>
        )}
      </div>

      {/* Friends Activity */}
      {friendsWatching.length > 0 && (
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
            <Users size={16} className="mr-2" />
            Bạn bè đang xem
          </h4>

          <div className="space-y-2">
            {friendsWatching.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">{friend.avatar}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-slate-700">{friend.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Tập {friend.episode}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`text-xs ${
                      friend.status === "completed" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {friend.status === "completed" ? "Hoàn thành" : "Đang xem"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
        <h4 className="font-semibold text-slate-700 mb-3 flex items-center">
          <Trophy size={16} className="mr-2" />
          Thành tích
        </h4>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
            <Gift size={16} className="text-yellow-600" />
            <div>
              <div className="text-xs font-semibold text-yellow-700">Người xem đầu tiên</div>
              <div className="text-xs text-yellow-600">Xem trong 24h đầu</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
            <MessageSquare size={16} className="text-blue-600" />
            <div>
              <div className="text-xs font-semibold text-blue-700">Người bình luận</div>
              <div className="text-xs text-blue-600">5+ bình luận</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
