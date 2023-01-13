import { useInterval } from '@mantine/hooks'
import { createContext, useEffect, useState } from 'react'

export const DonationContext = createContext()

const DonationProvider = ({ children }) => {
  const [donations, setDonations] = useState([])
  const [ttsQueue, setTTSQueue] = useState([])
  const [isAutoplay, setIsAutoplay] = useState(false)

  const [isPlaying, setIsPlaying] = useState(false)

  const ttsInterval = useInterval(() => {
    if (ttsQueue.length > 0 && isAutoplay && !isPlaying) {
      const audio = new Audio(ttsQueue[0])
      audio.play().then(() => {
        setIsPlaying(true)
      })

      audio.addEventListener('ended', () => {
        setIsPlaying(false)
        if (isAutoplay) {
          setTTSQueue((prev) => prev.slice(1))
        }
      })
    }
  }, 500)

  useEffect(() => {
    ttsInterval.start()

    return () => {
      ttsInterval.stop()
    }
  }, [ttsInterval])

  return (
    <DonationContext.Provider
      value={{
        donations,
        setDonations,
        isAutoplay,
        setIsAutoplay,
        ttsQueue,
        setTTSQueue,
      }}
    >
      {children}
    </DonationContext.Provider>
  )
}

export default DonationProvider
