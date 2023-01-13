import { useInterval } from '@mantine/hooks'
import { createContext, useEffect, useState } from 'react'

export const DonationContext = createContext()

const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([])
  const [ttsQueue, setTTSQueue] = useState([])
  const [isAutoplay, setIsAutoplay] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false)
  const [ttsAudio, setTTSAudio] = useState(null)

  const ttsInterval = useInterval(() => {
    if (ttsQueue.length > 0 && isAutoplay && !isPlaying) {
      setIsPlaying(true)

      const _audio = new Audio(ttsQueue[0])

      _audio.play()

      _audio.addEventListener('ended', () => {
        setIsPlaying(false)
        setTTSQueue((prev) => prev.slice(1))
      })

      setTTSAudio(_audio)
    }
  }, 500)

  // restart loops when data changes
  useEffect(() => {
    ttsInterval.stop()
    ttsInterval.start()
  }, [isAutoplay, ttsInterval])

  useEffect(() => {
    ttsInterval.start()

    return () => {
      ttsInterval.stop()
    }
    // eslint-disable-next-line
  }, [])

  return (
    <DonationContext.Provider
      value={{
        donations,
        setDonations,
        isAutoplay,
        setIsAutoplay,
        ttsQueue,
        setTTSQueue,
        ttsAudio,
        setTTSAudio,
        isPlaying,
        setIsPlaying,
      }}
    >
      {children}
    </DonationContext.Provider>
  )
}

export default DonationProvider
