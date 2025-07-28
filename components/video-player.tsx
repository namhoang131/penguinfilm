"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface VideoPlayerProps {
  movieId: string
  episode: number
  movieTitle: string
  episodes: Array<{ episode: number; filename: string; title: string }>
  onEpisodeChange: (episode: number) => void
}

export default function VideoPlayer({ movieId, episode, movieTitle, episodes, onEpisodeChange }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)

  const currentEpisode = episodes.find((ep) => ep.episode === episode)
  const videoSrc = `/movies/${movieId}/${currentEpisode?.filename}`

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("ended", handleVideoEnd)

    // Load saved progress
    const savedProgress = localStorage.getItem(`penguin-progress-${movieId}-${episode}`)
    if (savedProgress) {
      video.currentTime = Number.parseFloat(savedProgress)
    }

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("ended", handleVideoEnd)
    }
  }, [movieId, episode])

  // Save progress periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && currentTime > 0) {
        localStorage.setItem(`penguin-progress-${movieId}-${episode}`, currentTime.toString())
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [movieId, episode, currentTime])

  const handleVideoEnd = () => {
    // Auto play next episode
    const nextEpisode = episodes.find((ep) => ep.episode === episode + 1)
    if (nextEpisode) {
      onEpisodeChange(nextEpisode.episode)
    }
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const handleVolumeChange = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = value[0]
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    if (isMuted) {
      video.volume = volume
      setIsMuted(false)
    } else {
      video.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    const video = videoRef.current
    if (!video) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      video.requestFullscreen()
    }
  }

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 2]
    const currentIndex = rates.indexOf(playbackRate)
    const nextRate = rates[(currentIndex + 1) % rates.length]

    const video = videoRef.current
    if (video) {
      video.playbackRate = nextRate
      setPlaybackRate(nextRate)
    }
  }

  const skipEpisode = (direction: "prev" | "next") => {
    const targetEpisode = direction === "next" ? episode + 1 : episode - 1
    const targetEp = episodes.find((ep) => ep.episode === targetEpisode)
    if (targetEp) {
      onEpisodeChange(targetEp.episode)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl overflow-hidden shadow-2xl bg-black/20 backdrop-blur-md border border-white/20"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Element */}
      <video ref={videoRef} className="w-full aspect-video" src={videoSrc} onClick={togglePlay} />

      {/* Controls Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"
      >
        {/* Top Info */}
        <div className="absolute top-4 left-4 right-4 pointer-events-auto">
          <div className="flex justify-between items-start">
            <div className="text-white">
              <h3 className="font-bold text-lg font-['Poppins']">{movieTitle}</h3>
              <p className="text-sm opacity-80">
                Tập {episode}: {currentEpisode?.title}
              </p>
            </div>
            <Button
              onClick={changePlaybackRate}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-lg"
            >
              {playbackRate}x
            </Button>
          </div>
        </div>

        {/* Center Play Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <Button
              onClick={togglePlay}
              size="lg"
              className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
            >
              <Play className="text-white ml-1" size={24} />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
          {/* Progress Bar */}
          <div className="mb-4">
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-blue-400 [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-blue-400"
            />
            <div className="flex justify-between text-xs text-white/80 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => skipEpisode("prev")}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-lg"
                disabled={episode === 1}
              >
                <SkipBack size={20} />
              </Button>

              <Button
                onClick={togglePlay}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-lg"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </Button>

              <Button
                onClick={() => skipEpisode("next")}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 rounded-lg"
                disabled={episode === episodes.length}
              >
                <SkipForward size={20} />
              </Button>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  onClick={toggleMute}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-lg"
                >
                  {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </Button>
                <div className="w-20">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="[&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white"
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 rounded-lg"
            >
              <Maximize size={20} />
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
