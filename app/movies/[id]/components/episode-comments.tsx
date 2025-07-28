"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, Send, Heart, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Comment {
  id: string
  user: string
  content: string
  timestamp: number
  likes: number
  replies: Comment[]
}

interface EpisodeCommentsProps {
  movieId: string
  episode: number
}

export default function EpisodeComments({ movieId, episode }: EpisodeCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")

  useEffect(() => {
    // Load comments from localStorage
    const savedComments = localStorage.getItem(`penguin-comments-${movieId}-${episode}`)
    if (savedComments) {
      setComments(JSON.parse(savedComments))
    } else {
      // Start with empty comments array
      setComments([])
    }
  }, [movieId, episode])

  const saveComments = (updatedComments: Comment[]) => {
    localStorage.setItem(`penguin-comments-${movieId}-${episode}`, JSON.stringify(updatedComments))
    setComments(updatedComments)
  }

  const addComment = () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      user: "Bạn", // In real app, get from user context
      content: newComment,
      timestamp: Date.now(),
      likes: 0,
      replies: [],
    }

    const updatedComments = [comment, ...comments]
    saveComments(updatedComments)
    setNewComment("")
  }

  const addReply = (parentId: string) => {
    if (!replyContent.trim()) return

    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      user: "Bạn",
      content: replyContent,
      timestamp: Date.now(),
      likes: 0,
      replies: [],
    }

    const updatedComments = comments.map((comment) => {
      if (comment.id === parentId) {
        return { ...comment, replies: [...comment.replies, reply] }
      }
      return comment
    })

    saveComments(updatedComments)
    setReplyContent("")
    setReplyTo(null)
  }

  const likeComment = (commentId: string, isReply = false, parentId?: string) => {
    const updatedComments = comments.map((comment) => {
      if (isReply && comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === commentId ? { ...reply, likes: reply.likes + 1 } : reply,
          ),
        }
      } else if (comment.id === commentId) {
        return { ...comment, likes: comment.likes + 1 }
      }
      return comment
    })

    saveComments(updatedComments)
  }

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days} ngày trước`
    if (hours > 0) return `${hours} giờ trước`
    if (minutes > 0) return `${minutes} phút trước`
    return "Vừa xong"
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-slate-700 mb-4 font-['Poppins'] flex items-center">
        <MessageCircle className="mr-2" size={20} />
        Bình luận ({comments.length})
      </h3>

      {/* Add Comment */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20">
        <Textarea
          placeholder="Chia sẻ cảm nghĩ của bạn về tập phim này..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="mb-3 border-blue-200 focus:border-blue-400 resize-none"
          rows={3}
        />
        <div className="flex justify-end">
          <Button
            onClick={addComment}
            disabled={!newComment.trim()}
            className="bg-blue-500 hover:bg-blue-600 rounded-xl"
          >
            <Send size={16} className="mr-2" />
            Gửi bình luận
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        <AnimatePresence>
          {comments.map((comment) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/20"
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">{comment.user[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-700">{comment.user}</span>
                    <span className="text-xs text-slate-500">{formatTime(comment.timestamp)}</span>
                  </div>

                  <p className="text-slate-600 mb-2 font-['Nunito']">{comment.content}</p>

                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => likeComment(comment.id)}
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-red-500 p-0 h-auto"
                    >
                      <Heart size={14} className="mr-1" />
                      {comment.likes}
                    </Button>

                    <Button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      variant="ghost"
                      size="sm"
                      className="text-slate-500 hover:text-blue-500 p-0 h-auto"
                    >
                      <Reply size={14} className="mr-1" />
                      Trả lời
                    </Button>
                  </div>

                  {/* Reply Form */}
                  <AnimatePresence>
                    {replyTo === comment.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3"
                      >
                        <div className="flex gap-2">
                          <Textarea
                            placeholder="Viết phản hồi..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="flex-1 border-blue-200 focus:border-blue-400 resize-none"
                            rows={2}
                          />
                          <Button
                            onClick={() => addReply(comment.id)}
                            disabled={!replyContent.trim()}
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 rounded-xl"
                          >
                            <Send size={14} />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 space-y-3 pl-4 border-l-2 border-blue-100">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex items-start gap-3">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                              {reply.user[0]}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-slate-700 text-sm">{reply.user}</span>
                              <span className="text-xs text-slate-500">{formatTime(reply.timestamp)}</span>
                            </div>

                            <p className="text-slate-600 text-sm mb-1 font-['Nunito']">{reply.content}</p>

                            <Button
                              onClick={() => likeComment(reply.id, true, comment.id)}
                              variant="ghost"
                              size="sm"
                              className="text-slate-500 hover:text-red-500 p-0 h-auto text-xs"
                            >
                              <Heart size={12} className="mr-1" />
                              {reply.likes}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
