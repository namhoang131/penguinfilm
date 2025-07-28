"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface MovieTrailerModalProps {
  movie: any
  isOpen: boolean
  onClose: () => void
}

export default function MovieTrailerModal({ movie, isOpen, onClose }: MovieTrailerModalProps) {
  const [isMuted, setIsMuted] = useState(true)

  const trailerUrl = `/movies/${movie.id}/trailer.mp4`

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-0">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative rounded-2xl overflow-hidden bg-black"
        >
          {/* Close Button */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4 z-10 text-white hover:bg-white/20 rounded-full"
          >
            <X size={20} />
          </Button>

          {/* Video Player */}
          <div className="relative aspect-video">
            <video
              src={trailerUrl}
              autoPlay
              muted={isMuted}
              loop
              className="w-full h-full object-cover"
              onError={() => {
                // Fallback to poster image if trailer not available
                console.log("Trailer not available")
              }}
            />

            {/* Overlay Controls */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-end justify-between">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2 font-['Poppins']">{movie.title}</h3>
                    <p className="text-sm opacity-80 max-w-md">{movie.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setIsMuted(!isMuted)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 rounded-full"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
