"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward, Settings, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"

interface VideoPlayerProps {
  movieId: string
  episode: number
  movieTitle: string
  episodes: Array<{ episode: number; filename: string; title: string }>
  onEpisodeChange: (episode: number) => void
}

export default function EnhancedVideoPlayer({
  movieId,
  episode,
  movieTitle,
  episodes,
  onEpisodeChange,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  // Touch gesture states
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [lastTap, setLastTap] = useState(0)

  const currentEpisode = episodes.find((ep) => ep.episode === episode)
  const videoSrc = `/movies/${movieId}/${currentEpisode?.filename}`

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return

      switch (e.code) {
        case "Space":
          e.preventDefault()
          togglePlay()
          break
        case "ArrowLeft":
          e.preventDefault()
          skipTime(-10)
          break
        case "ArrowRight":
          e.preventDefault()
          skipTime(10)
          break
        case "ArrowUp":
          e.preventDefault()
          changeVolume(0.1)
          break
        case "ArrowDown":
          e.preventDefault()
          changeVolume(-0.1)
          break
        case "KeyF":
          e.preventDefault()
          toggleFullscreen()
          break
        case "KeyM":
          e.preventDefault()
          toggleMute()
          break
      }
    }

    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [])

  // Video event listeners
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    const handleWaiting = () => setIsBuffering(true)
    const handleCanPlay = () => setIsBuffering(false)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("loadedmetadata", updateDuration)
    video.addEventListener("ended", handleVideoEnd)
    video.addEventListener("waiting", handleWaiting)
    video.addEventListener("canplay", handleCanPlay)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    // Load saved progress
    const savedProgress = localStorage.getItem(`penguin-progress-${movieId}-${episode}`)
    if (savedProgress) {
      video.currentTime = Number.parseFloat(savedProgress)
    }

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("loadedmetadata", updateDuration)
      video.removeEventListener("ended", handleVideoEnd)
      video.removeEventListener("waiting", handleWaiting)
      video.removeEventListener("canplay", handleCanPlay)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [movieId, episode])

  // Fullscreen detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (showControls && isPlaying) {
      timeout = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    return () => clearTimeout(timeout)
  }, [showControls, isPlaying])

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
    const nextEpisode = episodes.find((ep) => ep.episode === episode + 1)
    if (nextEpisode) {
      onEpisodeChange(nextEpisode.episode)
    }
  }

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
  }, [isPlaying])

  const handleSeek = (value: number[]) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = value[0]
    setCurrentTime(value[0])
  }

  const skipTime = (seconds: number) => {
    const video = videoRef.current
    if (!video) return

    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds))
  }

  const changeVolume = (delta: number) => {
    const video = videoRef.current
    if (!video) return

    const newVolume = Math.max(0, Math.min(1, volume + delta))
    video.volume = newVolume
    setVolume(newVolume)
    setIsMuted(newVolume === 0)
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
    const container = containerRef.current
    if (!container) return

    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen()
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

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    })
    setIsDragging(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart) return

    const touch = e.touches[0]
    const deltaX = Math.abs(touch.clientX - touchStart.x)
    const deltaY = Math.abs(touch.clientY - touchStart.y)

    if (deltaX > 10 || deltaY > 10) {
      setIsDragging(true)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || isDragging) {
      setTouchStart(null)
      setIsDragging(false)
      return
    }

    const now = Date.now()
    const timeDiff = now - touchStart.time

    // Double tap detection
    if (now - lastTap < 300) {
      toggleFullscreen()
      setLastTap(0)
    } else {
      setLastTap(now)
      // Single tap - toggle controls
      if (timeDiff < 200) {
        setShowControls(!showControls)
      }
    }

    setTouchStart(null)
    setIsDragging(false)
  }

  // Mouse gesture handlers
  const handleVideoClick = (e: React.MouseEvent) => {
    if (e.detail === 1) {
      // Single click - toggle play/pause
      setTimeout(() => {
        if (e.detail === 1) {
          togglePlay()
        }
      }, 200)
    }
  }

  const handleVideoDoubleClick = () => {
    toggleFullscreen()
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const shareVideo = () => {
    if (navigator.share) {
      navigator.share({
        title: `${movieTitle} - Tập ${episode}`,
        text: `Xem ${movieTitle} tập ${episode} trên Penguin Film`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      // You could add a toast notification here
    }
  }

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl overflow-hidden shadow-2xl bg-black/20 backdrop-blur-md border border-white/20 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""
      }`}
      onMouseEnter={() => setShowControls(true)}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => !isFullscreen && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full aspect-video bg-black"
        src={videoSrc}
        onClick={handleVideoClick}
        onDoubleClick={handleVideoDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Loading Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Controls Overlay */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none"
          >
            {/* Top Info Bar */}
            <div className="absolute top-4 left-4 right-4 pointer-events-auto">
              <div className="flex justify-between items-start">
                <div className="text-white">
                  <h3 className="font-bold text-lg font-['Poppins']">{movieTitle}</h3>
                  <p className="text-sm opacity-80">
                    Tập {episode}: {currentEpisode?.title}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-black/50 text-white border-white/20">
                    {playbackRate}x
                  </Badge>
                  <Button
                    onClick={shareVideo}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-lg"
                  >
                    <Share2 size={16} />
                  </Button>
                  <Button
                    onClick={() => setShowSettings(!showSettings)}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-lg"
                  >
                    <Settings size={16} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Center Play Button */}
            {!isPlaying && !isBuffering && (
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

                  <div className="flex items-center gap-2 ml-4 relative">
                    <Button
                      onClick={toggleMute}
                      onMouseEnter={() => setShowVolumeSlider(true)}
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-white/20 rounded-lg"
                    >
                      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </Button>

                    <AnimatePresence>
                      {showVolumeSlider && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="w-20"
                          onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                          <Slider
                            value={[isMuted ? 0 : volume]}
                            max={1}
                            step={0.1}
                            onValueChange={handleVolumeChange}
                            className="[&>span:first-child]:h-1 [&>span:first-child]:bg-white/30 [&_[role=slider]]:bg-white [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-white"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Button
                    onClick={changePlaybackRate}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-lg ml-2"
                  >
                    {playbackRate}x
                  </Button>
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

            {/* Settings Panel */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, x: 300 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 300 }}
                  className="absolute top-16 right-4 bg-black/80 backdrop-blur-md rounded-xl p-4 text-white pointer-events-auto min-w-48"
                >
                  <h4 className="font-bold mb-3">Cài đặt</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm opacity-80">Tốc độ phát</label>
                      <div className="flex gap-1 mt-1">
                        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                          <Button
                            key={rate}
                            onClick={() => {
                              if (videoRef.current) {
                                videoRef.current.playbackRate = rate
                                setPlaybackRate(rate)
                              }
                            }}
                            variant={playbackRate === rate ? "default" : "ghost"}
                            size="sm"
                            className="text-xs"
                          >
                            {rate}x
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-4 left-4 text-xs text-white/60 pointer-events-none">
        <div className="hidden md:block">
          Space: Phát/Dừng | ←→: Tua | ↑↓: Âm lượng | F: Toàn màn hình | M: Tắt tiếng
        </div>
        <div className="md:hidden">Chạm: Hiện/Ẩn điều khiển | Chạm đôi: Toàn màn hình</div>
      </div>
    </motion.div>
  )
}
