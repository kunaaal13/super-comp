import { cn } from '@/lib/utils'
import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
} from '@heroicons/react/24/solid'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import Song from '../lib/song.json'
import { Slider } from './ui/slider'

function AppleMusicPlayer() {
  // State for play/pause
  const [isPlaying, setIsPlaying] = useState(false)

  // Time handling state for time stamp
  const [time, setTime] = useState(0)

  // lyrics array
  const lyrics = useMemo(() => {
    return Object.entries(Song.songLyrics).map((lyric) => lyric[1])
  }, [])

  // lyrics container ref
  const lyricsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isPlaying) {
      if (time >= Song.songDuration) {
        setIsPlaying(false)
        setTime(0)

        return
      }

      const interval = setInterval(() => {
        setTime((time) => time + 1)
      }, 1000)

      return () => {
        clearInterval(interval)
      }
    }
  }, [isPlaying, time])

  const activeLyricIndex = useMemo(() => {
    const avgLyricsDuration = Song.songDuration / lyrics.length

    const value = Math.floor(time / avgLyricsDuration)

    lyricsContainerRef.current?.scrollTo({
      top: getHeightOfLyric(value),
      behavior: 'smooth',
    })

    return value
  }, [time])

  function getHeightOfLyric(index: number) {
    if (index === 0) {
      return 0
    }

    if (lyricsContainerRef.current) {
      const lyricPrev = lyricsContainerRef.current.children[
        index - 1
      ] as HTMLElement

      if (lyricPrev) {
        // Scroll to the top of the lyric
        return lyricPrev.offsetTop - lyricsContainerRef.current.offsetTop
      }
    }

    return 0
  }

  function formatTime(seconds: number) {
    // seconds to mm:ss
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const renderMinutes = minutes < 10 ? `0${minutes}` : minutes
    const renderSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds

    return `${renderMinutes}:${renderSeconds}`
  }

  return (
    <div className='flex flex-col items-center justify-center space-y-5 w-[30%] rounded-2xl py-5 px-2 text-white bg-black/90'>
      {/* Lyrics go here */}
      <AnimatePresence>
        <motion.div
          ref={lyricsContainerRef}
          className='h-60 w-full rounded-xl overflow-y-scroll py-5 px-4 flex flex-col'
        >
          {lyrics.map((lyric, index) => (
            <motion.button
              key={index}
              className={cn(
                'font-semibold text-3xl text-left p-2 bg-transparent hover:bg-gray-600 mb-3 rounded-lg',
                index === activeLyricIndex ? 'text-white' : 'text-white/70'
              )}
              onClick={() => {
                setTime((index / lyrics.length) * Song.songDuration)
              }}
            >
              {lyric}
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Description goes here */}
      <div className='flex w-full items-center space-x-5 py-2 px-4'>
        {/* Song Cover */}
        <img
          src={Song.coverImage}
          alt='Song Cover'
          className='w-20 h-20 rounded-2xl object-cover shadow-sm'
        />

        {/* Song Info */}
        <div className='flex flex-col space-y-1'>
          <h1 className='leading-snug font-medium text-2xl truncate'>
            {Song.songName}
          </h1>
          <p className='text-sm leading-snug text-gray-100 truncate'>
            by {Song.artistName}
          </p>
        </div>
      </div>

      {/* Controls go here */}
      <div className='flex flex-col space-y-5 w-full px-4 items-center'>
        {/* Slider  */}
        <AnimatePresence>
          <div className='w-full flex space-y-2 flex-col'>
            <Slider
              max={100}
              value={[(time / Song.songDuration) * 100]}
              onValueChange={([value]) =>
                setTime(Math.floor((value / 100) * Song.songDuration))
              }
            />

            <div className='flex justify-between text-white text-xs'>
              <p>{formatTime(time)}</p>
              <p>{formatTime(Song.songDuration - time)}</p>
            </div>
          </div>
        </AnimatePresence>

        {/* Controls */}
        <div className='flex items-center justify-between w-1/2 text-white'>
          <BackwardIcon className='size-8 cursor-pointer' />

          <button
            onClick={() => {
              setIsPlaying(!isPlaying)
            }}
          >
            {isPlaying ? (
              <PauseIcon className='size-8' />
            ) : (
              <PlayIcon className='size-8' />
            )}
          </button>

          <ForwardIcon className='size-8 cursor-pointer' />
        </div>
      </div>
    </div>
  )
}

export default AppleMusicPlayer
