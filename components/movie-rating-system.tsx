"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MovieRatingSystemProps {
  movieId: string
  movieTitle: string
}

export default function MovieRatingSystem({ movieId, movieTitle }: MovieRatingSystemProps) {
  const [userRating, setUserRating] = useState(0)
  const [averageRating, setAverageRating] = useState(0)
  const [totalRatings, setTotalRatings] = useState(0)
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null)
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)

  useEffect(() => {
    // Load ratings from localStorage
    const ratings = JSON.parse(localStorage.getItem(`penguin-ratings-${movieId}`) || "{}")
    const votes = JSON.parse(localStorage.getItem(`penguin-votes-${movieId}`) || "{}")

    if (ratings.userRating) setUserRating(ratings.userRating)
    if (ratings.average) setAverageRating(ratings.average)
    if (ratings.total) setTotalRatings(ratings.total)

    if (votes.userVote) setUserVote(votes.userVote)
    setLikes(votes.likes || Math.floor(Math.random() * 100) + 50)
    setDislikes(votes.dislikes || Math.floor(Math.random() * 20) + 5)
  }, [movieId])

  const handleStarRating = (rating: number) => {
    setUserRating(rating)

    // Simulate updating average (in real app, this would be server-side)
    const newTotal = totalRatings + 1
    const newAverage = (averageRating * totalRatings + rating) / newTotal

    setAverageRating(newAverage)
    setTotalRatings(newTotal)

    // Save to localStorage
    const ratings = {
      userRating: rating,
      average: newAverage,
      total: newTotal,
    }
    localStorage.setItem(`penguin-ratings-${movieId}`, JSON.stringify(ratings))
  }

  const handleVote = (vote: "up" | "down") => {
    if (userVote === vote) {
      // Remove vote
      setUserVote(null)
      if (vote === "up") {
        setLikes(likes - 1)
      } else {
        setDislikes(dislikes - 1)
      }
    } else {
      // Change or add vote
      if (userVote) {
        // Change existing vote
        if (userVote === "up") {
          setLikes(likes - 1)
          setDislikes(dislikes + 1)
        } else {
          setDislikes(dislikes - 1)
          setLikes(likes + 1)
        }
      } else {
        // Add new vote
        if (vote === "up") {
          setLikes(likes + 1)
        } else {
          setDislikes(dislikes + 1)
        }
      }
      setUserVote(vote)
    }

    // Save to localStorage
    const votes = {
      userVote: userVote === vote ? null : vote,
      likes: vote === "up" ? (userVote === vote ? likes - 1 : likes + 1) : likes,
      dislikes: vote === "down" ? (userVote === vote ? dislikes - 1 : dislikes + 1) : dislikes,
    }
    localStorage.setItem(`penguin-votes-${movieId}`, JSON.stringify(votes))
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
      <h3 className="font-bold text-lg text-slate-700 mb-4 font-['Poppins']">Đánh giá phim</h3>

      {/* Star Rating */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm text-slate-600">Đánh giá của bạn:</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleStarRating(star)}
                className="focus:outline-none"
              >
                <Star
                  size={20}
                  className={`${
                    star <= userRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 hover:text-yellow-300"
                  } transition-colors`}
                />
              </motion.button>
            ))}
          </div>
          {userRating > 0 && (
            <Badge variant="secondary" className="ml-2">
              {userRating}/5
            </Badge>
          )}
        </div>

        {/* Average Rating Display */}
        {totalRatings > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
            </div>
            <span>({totalRatings} đánh giá)</span>
          </div>
        )}
      </div>

      {/* Like/Dislike */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => handleVote("up")}
          variant={userVote === "up" ? "default" : "outline"}
          size="sm"
          className={`rounded-xl ${
            userVote === "up" ? "bg-green-500 hover:bg-green-600" : "border-green-200 hover:bg-green-50"
          }`}
        >
          <ThumbsUp size={16} className="mr-2" />
          {likes}
        </Button>

        <Button
          onClick={() => handleVote("down")}
          variant={userVote === "down" ? "default" : "outline"}
          size="sm"
          className={`rounded-xl ${
            userVote === "down" ? "bg-red-500 hover:bg-red-600" : "border-red-200 hover:bg-red-50"
          }`}
        >
          <ThumbsDown size={16} className="mr-2" />
          {dislikes}
        </Button>
      </div>
    </div>
  )
}
